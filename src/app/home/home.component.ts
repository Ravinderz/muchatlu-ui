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
  conversationId:any;
  conversation:any;
  friendDetails: any;
  selectedItemIndex: any = 0;

  constructor(private userService: UserService, private messageService: MessageService, private commonService:CommonService) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }


  ngOnInit() {
    if (this.loggedUser) {
      console.log("inside logged user :: ", this.loggedUser)

      this.subscriptions.push(this.userService.getUserConversations(this.loggedUser.id).subscribe((value: any) => {

        if (!this.conversations) {
          this.conversations = [];
        }

        console.log("conversations ::: ", value)
        value.forEach(element => {
          if (element && element != null && typeof element == 'object') {
            this.conversations.push(element)
          }
        });

        this.list = this.conversations;
        this.listType = 'chats';
        this.selectedListItem = this.list[0];
      }));

      this.subscriptions.push(this.userService.getFriends(this.loggedUser).subscribe((value: any) => {

        if (!this.friends) {
          this.friends = [];
        }

        console.log("friends ::: ", value)
        value.friends.forEach(element => {
          if (element && element != null && typeof element == 'object') {
            this.friends.push(element)
          }
        });
      }));

      this.userService.getFriendRequests(this.loggedUser.id).subscribe(value => {
        console.log(value);
        this.friendRequests = value;
      });

    }

    // code for friend request subscription
    this.subscriptions.push(this.messageService.friendRequestEvent.subscribe((value) => {
      console.log("Inside chat window, friendRequest event value ::: ", value);
      //let updatedFriends = this.friends;
      if (!this.friendRequests) {
        this.friendRequests = [];
      }

      if (value && value.requestFromUserId && value.status === 'PENDING') {
        this.friendRequests.push(value);
      }


        if (value.requestFromUser && value.status === 'ACCEPTED') {
          console.log("isndie accepted status ::::: ", value)
          console.log("isndie accepted status logged user ::::: ", this.loggedUser)
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
        console.log('sindie rejectred  ... ', this.list);
        this.friendRequests.forEach((element, index) => {
          if (element.id === value.id) {
            this.friendRequests.splice(index, 1);
          }
        });
      }

    }));

    //code for friendRequest subscription ends here

  }

  loadPage(name: string, e: any) {
    e.preventDefault();
    this.activeLink = name;
    this.listType = name;
    if (name === "chats") {
      this.placeholder = 'Search';
      this.list = this.conversations;
      this.selectedListItem = this.list[0];
      this.itemType = name;
      this.selectedItemIndex = 0;
    }
    if (name === "friends") {
      this.placeholder = 'Search / Add friends';
      this.list = this.friends;
      this.friendDetails = this.list[0];
      this.itemType = name;
      this.selectedItemIndex = 0;
    }
    if (name === "friend requests") {
      this.placeholder = 'Search / Add friends';
      this.list = this.friendRequests;
      this.selectedListItem = this.list[0];
      this.itemType = name;
      this.selectedItemIndex = 0;
    }
    if (name === "groups") {
      this.placeholder = 'Search';
      this.list = this.friends;
      this.itemType = name;
      this.selectedItemIndex = 0;
    }
  }

  itemSelected(e: any) {
    console.log(e)
    this.selectedListItem = e.selectedItem;
    if (e.itemType === 'friend requests') {
      this.showFriendRequestDetails = true;
    }
    this.itemType = e.itemType;
    this.conversationId = e.conversationId;
    if (e.itemType === 'chats') {
      this.conversation = e.conversation;
    }
    if(e.itemType === 'friends'){
      this.friendDetails = e.selectedItem;
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

  startChat(value: any){
    console.log("start chat ",value);

  }

  frndRqstSent(value: any){
    console.log("friendrequestsenbt",value);
    this.list = value;
    this.listType = 'friend requests';
  }

  ngOnDestroy(){
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
