import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from '../common.service';
import { MessageService } from '../message.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit, OnChanges, OnDestroy {

  @Input() list: any;
  @Input() listType: string;
  @Input() selectedItemIndex: any;
  @Output() selectedItemEvent = new EventEmitter<any>();
  @Output() friendRequestEvent = new EventEmitter<any>();

  friendRequests: any;
  screenWidth: number;

  constructor(private messageService: MessageService, private userService: UserService, private commonService: CommonService) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
    this.screenWidth = window.innerWidth;
  }

  adjustForTimezone(value: Date): any {
    if (value) {
      let date = new Date(value);
      var timeOffsetInMS: number = new Date().getTimezoneOffset() * 60000;
      date.setTime(date.getTime() + timeOffsetInMS);
      return date.toISOString();
    } else {
      return value;
    }

  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (this.screenWidth >= 550) {
      if (this.listType === 'friend requests') {
      }
      if (this.listType === 'chats') {
        if (changes.list.currentValue && changes.list.currentValue.length > 0) {
          this.selectedItem(0)
          // if (this.selectedItemIndex) {
          //   this.selectedItem(this.selectedItemIndex)
          // } else {
          //   if (this.list.length > 0)
          //     this.selectedItem(0)
          // }
        }
      }
      if (this.listType === 'friends') {
        if (changes.list.currentValue && changes.list.currentValue.length > 0) {
          this.selectedItem(0)
          // if (this.selectedItemIndex) {
          //   this.selectedItem(this.selectedItemIndex)
          // } else {
          //   if (this.list.length > 0)
          //     this.selectedItem(0)
          // }
        }
      }
    }
  }

  loggedUser: any;

  subscriptions: Subscription[] = [];

  ngOnInit() {
    console.log(this.selectedItemIndex);
    if (this.screenWidth >= 550) {
      console.log("inside if")
      if (this.selectedItemIndex) {
        this.selectedItem(this.selectedItemIndex)
      } else {
        if (this.list.length > 0)
          this.selectedItem(0)
      }
    }

    this.subscriptions.push(this.messageService.loginEvent.subscribe((value) => {

      this.list.forEach(element => {
        if (element.id === value.userId) {
          element.isOnline = value.online;
        }
      });

    }));

    this.subscriptions.push(this.messageService.logoutEvent.subscribe((value) => {

      this.list.forEach(element => {
        if (element.id === value.userId) {
          element.isOnline = value.online;
        }
      });

    }));

    this.subscriptions.push(this.messageService.friendRequestEvent.subscribe((value) => {

      if (value) {
        console.log(value);
        if (!this.list) {
          this.list = [];
        }
        this.list.push(value);
      }

    }));

  }



  selectedItem(index: any) {

    this.selectedItemIndex = index;

    if (this.listType === 'friends') {
      console.log(this.list);
      console.log(index);
      this.commonService.getConversationId(this.loggedUser.id, this.list[index].id).subscribe(value => {
        let obj = {
          'selectedItem': this.list[index],
          'itemType': this.listType,
          'conversationId': value
        }
        this.selectedItemEvent.emit(obj);
      })
    } else if (this.listType === 'chats') {
      console.log(this.list);
      console.log(index);
      this.commonService.getConversation(this.list[index].userIdFrom, this.list[index].userIdTo).subscribe(value => {
        let obj = {
          'selectedItem': this.list[index],
          'itemType': this.listType,
          'conversation': value
        }
        console.log(obj.selectedItem);
        this.userService.getUserPresence(obj.selectedItem.userIdTo).subscribe((value: any) => {
          console.log(value)
          obj.selectedItem.isUserToOnline = value.online;
          this.userService.getUserPresence(obj.selectedItem.userIdFrom).subscribe((value: any) => {
            obj.selectedItem.isUserFromOnline = value.online;
            this.selectedItemEvent.emit(obj);
          })
        })
      })
    } else {
      let obj = {
        'selectedItem': this.list[index],
        'itemType': this.listType
      }
      this.selectedItemEvent.emit(obj);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
