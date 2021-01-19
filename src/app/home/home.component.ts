import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from '../common.service';
import { MessageService } from '../message.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  loggedUser: any;
  selectedChatId: any;
  selectedFriend: any;
  text: String;
  chats: any;
  conversations: any;
  email: string;
  subscriptions: Subscription[] = [];
  friends: any;
  friendRequests: any;
  unreadMessages: any = {};
  activeLink: string = "chats";
  placeholder: string;
  list: any;
  listType: String = 'friend';
  itemType: any;
  selectedListItem: any;
  showFriendRequestDetails = false;
  conversationId: any;
  conversation: any;
  friendDetails: any;
  selectedItemIndex: any = 0;

  constructor(private userService: UserService, private messageService: MessageService, private commonService: CommonService) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }


  ngOnInit() {
    if (this.loggedUser) {

      this.getConversation().then(() => { });
      this.getFriends().then(() => { });
      this.getFriendRequests().then(() => { });

    }

    // code for friend request subscription
    this.subscriptions.push(this.messageService.friendRequestEvent.subscribe((value) => {
      if (!this.friendRequests) {
        this.friendRequests = [];
      }

      if (value && value.requestFromUserId && value.status === 'PENDING') {
        this.friendRequests.push(value);
      }

      if (value.requestFromUser && value.status === 'ACCEPTED') {
        if (value.requestFromUserId === this.loggedUser.id) {
          if (value.requestToUser && value.requestToUser != null && typeof value.requestToUser == 'object') {
            this.friends.push(value.requestToUser);
          }
        } else if (value.requestToUserId === this.loggedUser.id) {
          if (value.requestFromUser && value.requestFromUser != null && typeof value.requestFromUser == 'object') {
            this.friends.push(value.requestFromUser)
          }
        }
      }

      if (value && value.status === 'REJECTED') {
        this.friendRequests.forEach((element, index) => {
          if (element.id === value.id) {
            this.friendRequests.splice(index, 1);
          }
        });
      }

    }));

    //code for friendRequest subscription ends here

  }

  async getConversation() {
    this.subscriptions.push(this.userService.getUserConversations(this.loggedUser.id).subscribe((value: any) => {

      if (!this.conversations) {
        this.conversations = [];
      }
      let temp = [];
      value.forEach(element => {
        if (element && element != null && typeof element == 'object') {
          temp.push(element);
        }
      });
      this.conversations = temp;

      this.list = this.conversations;
      this.listType = 'chats';
      this.selectedListItem = this.list[0];
    }));

  }

  async getFriends() {
    this.subscriptions.push(this.userService.getFriends(this.loggedUser).subscribe((value: any) => {

      if (!this.friends) {
        this.friends = [];
      }
      let temp = [];
      value.friends.forEach(element => {
        if (element && element != null && typeof element == 'object') {
          temp.push(element);
          //this.friends.push(element)
        }
      });
      this.friends = temp;

    }));
  }

  async getFriendRequests() {
    this.userService.getFriendRequests(this.loggedUser.id).subscribe(value => {
      console.log(value);
      this.friendRequests = value;
    });
  }

  loadPage(name: string, e: any) {
    if (name === "start chat") {
      this.getConversation().then(() => {
        this.placeholder = 'Search';
        this.list = this.conversations;
        this.selectedItemIndex = this.list.findIndex(x => x.id === e.conversationId);
        this.selectedListItem = this.list[this.selectedItemIndex];
        this.conversationId = e.conversationId;
        this.itemType = this.listType = "chats";
        this.conversation = this.list[this.selectedItemIndex];
      });

    } else {
      e.preventDefault();
      this.activeLink = name;
      this.listType = name;
      if (name === "chats") {
        this.getConversation().then(() => {
          this.placeholder = 'Search';
          this.list = this.conversations;
          this.selectedListItem = this.list[0];
          this.itemType = name;
          this.selectedItemIndex = 0;
        });
      }

      if (name === "friends") {
        this.getFriends().then(() => {
          this.placeholder = 'Search / Add friends';
          this.list = this.friends;
          this.friendDetails = this.list[0];
          this.itemType = name;
          this.selectedItemIndex = 0;
        });
      }
      if (name === "friend requests") {
        this.getFriendRequests().then(() => {
          this.placeholder = 'Search / Add friends';
          this.list = this.friendRequests;
          this.selectedListItem = this.list[0];
          this.itemType = name;
          this.selectedItemIndex = 0;
        });
      }
      if (name === "groups") {
        this.placeholder = 'Search';
        this.list = this.friends;
        this.itemType = name;
        this.selectedItemIndex = 0;
      }
    }
  }

  itemSelected(e: any) {
    this.selectedListItem = e.selectedItem;
    if (e.itemType === 'friend requests') {
      this.showFriendRequestDetails = true;
    }
    this.itemType = e.itemType;
    this.conversationId = e.conversationId;
    if (e.itemType === 'chats') {
      this.conversation = e.conversation;
    }
    if (e.itemType === 'friends') {
      this.friendDetails = e.selectedItem;
      this.friendDetails['conversationId'] = e.conversationId;
    }
  }

  addFriend(value: any) {

    if (value.requestFromUserId === this.loggedUser.id) {
      if (value.requestToUser && value.requestToUser != null && typeof value.requestToUser == 'object') {
        this.friends.add(value.requestToUser);
      }
    } else if (value.requestToUserId === this.loggedUser.id) {
      if (value.requestFromUser && value.requestFromUser != null && typeof value.requestFromUser == 'object') {
        this.friends.add(value.requestFromUser);
      }
    }
  }

  startChat(value: any) {

    var elm = document.getElementById('friends');
    elm.classList.remove("nav-active");
    elm = document.getElementById('chats');
    elm.classList.add("nav-active");
    this.loadPage('start chat', value);

  }

  frndRqstSent(value: any) {
    this.list = value;
    this.listType = 'friend requests';
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
