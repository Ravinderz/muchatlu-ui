import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from '../common.service';
import { MessageService } from '../message.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loggedUser: any;
  selectedChatId: any;
  selectedFriend: any;
  text: String;
  chats: any;
  email: string;
  subscriptions: Subscription[] = [];
  friends: any;

  friendRequests: any;

  unreadMessages: any = {};

  constructor(private userService: UserService, private messageService: MessageService, private commonService:CommonService) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }

  activeLink: String = "chats";
  placeholder: string;
  list: any;
  listType: String = 'friend';
  itemType: any;
  selectedListItem: any;
  showFriendRequestDetails = false;


  ngOnInit() {
    if (this.loggedUser) {
      console.log("inside logged user :: ", this.loggedUser)
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

        this.list = this.friends;
        this.listType = 'friend';
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
        this.commonService.friendChangeEvent.next(value);
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

  loadPage(name: String, e: any) {
    e.preventDefault();
    this.activeLink = name;
    this.listType = name;
    if (name === "chats") {
      console.log("load chats");
      this.placeholder = 'Search';
      this.list = this.friends;
    }
    if (name === "friends") {
      console.log("friends");
      this.placeholder = 'Search / Add friends';
      this.list = this.friends;
    }
    if (name === "friend requests") {
      console.log("friend requests");
      this.placeholder = 'Search / Add friends';
      this.list = this.friendRequests;
    }
    if (name === "groups") {
      console.log("groups");
      this.placeholder = 'Search';
      this.list = this.friends;
    }
  }

  itemSelected(e: any) {
    console.log(e)
    this.selectedListItem = e.selectedItem;
    if (e.itemType === 'friend requests') {
      this.showFriendRequestDetails = true;
    }
    this.itemType = e.itemType;

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

}
