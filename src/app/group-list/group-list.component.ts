import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from '../common.service';
import { MessageService } from '../message.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

  @Input() list: any;
  @Input() listType: string;

  @Output() selectedItemEvent = new EventEmitter<any>();
  @Output() friendRequestEvent = new EventEmitter<any>();

  friendRequests :any;

  constructor(private messageService:MessageService, private userService:UserService, private commonService: CommonService) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }

  loggedUser:any;
  selectedItemIndex: string;
  subscriptions:Subscription[] = [];

  ngOnInit() {
    console.log(this.list);

    this.subscriptions.push(this.messageService.loginEvent.subscribe((value) =>{
      console.log("Inside chat window, login event value ::: ",value);
      //let updatedFriends = this.friends;
      this.list.forEach(element => {
        if(element.id === value.userId){
          element.isOnline = value.online;
        }
      });

     // this.friends = updatedFriends;
    }));

    this.subscriptions.push(this.messageService.logoutEvent.subscribe((value) =>{
      console.log("Inside chat window, login event value ::: ",value);
      //let updatedFriends = this.friends;
      this.list.forEach(element => {
        if(element.id === value.userId){
          element.isOnline = value.online;
        }
      });

      //this.friends = updatedFriends;
    }));

    this.subscriptions.push(this.commonService.friendChangeEvent.subscribe((value) =>{

      if (value.requestFromUser && value.status === 'ACCEPTED') {
        console.log("isndie accepted status ::::: ", value)
        console.log("isndie accepted status logged user ::::: ", this.loggedUser)
        if (value.requestFromUserId === this.loggedUser.id) {
          if (value.requestToUser && value.requestToUser != null && typeof value.requestToUser == 'object') {
              this.list.push(value.requestToUser);
          }
        } else if (value.requestToUserId === this.loggedUser.id) {
          if (value.requestFromUser && value.requestFromUser != null && typeof value.requestFromUser == 'object') {
            this.list.push(value.requestFromUser)
          }
        }
      }
    }));



  }

  selectedItem(index:any){
    this.selectedItemIndex = index;
    let obj = {
      'selectedItem':this.list[index],
      'itemType':this.listType
    }
    this.selectedItemEvent.emit(obj);
  }
}
