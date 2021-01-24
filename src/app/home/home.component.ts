import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  listType: String;
  itemType: any;
  selectedListItem: any;
  showFriendRequestDetails = false;
  conversationId: any;
  conversation: any;
  friendDetails: any;
  selectedItemIndex: any;
  screenWidth: number;
  showListGroup: boolean = true;
  showMainContainer: boolean = true;
  showProfileContainer: boolean = true;
  activeContainer: string;
  lastActiveContainer: string;
  showProfile: boolean;

  constructor(private userService: UserService, private messageService: MessageService, private commonService: CommonService, private route: Router) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));

    this.screenWidth = window.innerWidth;
    this.activeContainer = 'showListGroup';
    this.updateLayout('showListGroup');
    if (this.screenWidth >= 550) {
      this.selectedItemIndex = 0;
      this.listType = 'friend';
    }
  }

  updateLayout(action: string) {
    if (this.screenWidth <= 550) {
      this.lastActiveContainer = this.activeContainer;
      this.activeContainer = action;
      if (action === 'showListGroup') {
        this.showListGroup = true;
        this.showMainContainer = false;
        this.showProfileContainer = false;
      } else if (action === 'showMainContainer') {
        this.showListGroup = false;
        this.showMainContainer = true;
        this.showProfileContainer = false;
      } else if (action === 'showProfileContainer') {
        this.showListGroup = false;
        this.showMainContainer = false;
        this.showProfileContainer = true;
      }
    } else {
      if (action === 'showProfileContainer') {
        this.showProfileContainer = true;
      } else {
        this.showProfileContainer = false;
      }
    }
  }


  ngOnInit() {

    if (this.loggedUser) {

      this.getConversation().then(() => { });
      this.getFriends().then(() => { });
      this.getFriendRequests().then(() => { });

    }

    this.subscriptions.push(this.commonService.showProfileEvent.subscribe((value: boolean) => {
      if (value) {
        this.updateLayout('showProfileContainer');
      } else {
        this.updateLayout(this.lastActiveContainer);
      }

    }));

    // code for friend request subscription
    this.subscriptions.push(this.messageService.friendRequestEvent.subscribe((value) => {
      if (!this.friendRequests) {
        this.friendRequests = [];
      }

      if (value && value.requestFromUserId && value.status === 'Pending') {
        this.friendRequests.push(value);
        this.loadPage('friend requests', null);
      }

      if (value.requestFromUser && value.status === 'Accepted') {
        if (value.requestFromUserId === this.loggedUser.id) {
          if (value.requestToUser && value.requestToUser != null && typeof value.requestToUser == 'object') {
            this.friends.push(value.requestToUser);
          }
        } else if (value.requestToUserId === this.loggedUser.id) {
          if (value.requestFromUser && value.requestFromUser != null && typeof value.requestFromUser == 'object') {
            this.friends.push(value.requestFromUser)
          }
        }

        this.loadPage('friends', null);

      }

      if (value && value.status === 'Rejected') {
        this.friendRequests.forEach((element, index) => {
          if (element.id === value.id) {
            this.friendRequests.splice(index, 1);
          }
        });
        this.loadPage('friend requests', null);
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
        this.updateLayout('showMainContainer');
      });

    } else {
      if (e) {
        e.preventDefault();
      }
      this.activeLink = name;
      this.listType = name;
      if (name === "chats") {
        this.getConversation().then(() => {
          this.placeholder = 'Search';
          this.list = this.conversations;
          this.selectedListItem = this.list[0];
          this.itemType = name;
          this.selectedItemIndex = 0;
          this.updateLayout('showListGroup');
        });
      }

      if (name === "friends") {
        this.getFriends().then(() => {
          this.placeholder = 'Search / Add friends';
          this.list = this.friends;
          this.friendDetails = this.list[0];
          this.itemType = name;
          this.selectedItemIndex = 0;
          this.updateLayout('showListGroup');
        });
      }
      if (name === "friend requests") {
        this.getFriendRequests().then(() => {
          this.placeholder = 'Search / Add friends';
          this.list = this.friendRequests;
          this.selectedListItem = this.list[0];
          this.itemType = name;
          this.selectedItemIndex = 0;
          this.updateLayout('showListGroup');
        });
      }
      if (name === "groups") {
        this.placeholder = 'Search';
        this.list = this.friends;
        this.itemType = name;
        this.selectedItemIndex = 0;
        this.updateLayout('showListGroup');
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
    this.updateLayout('showMainContainer');
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
    this.friendRequests.push(value);
    this.loadPage('friend requests', null);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
