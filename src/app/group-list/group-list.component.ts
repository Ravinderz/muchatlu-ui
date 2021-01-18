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
export class GroupListComponent implements OnInit,OnChanges ,OnDestroy {

  @Input() list: any;
  @Input() listType: string;
  @Input() selectedItemIndex: any;
  @Output() selectedItemEvent = new EventEmitter<any>();
  @Output() friendRequestEvent = new EventEmitter<any>();

  friendRequests :any;

  constructor(private messageService:MessageService, private userService:UserService, private commonService: CommonService) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }


  ngOnChanges(changes: SimpleChanges): void {
    if(this.listType === 'friend requests'){
      console.log(changes);
    }
  }

  loggedUser:any;

  subscriptions:Subscription[] = [];

  ngOnInit() {
    console.log(this.list);
    //this.selectedItemIndex = 0;

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
  }

  selectedItem(index:any){
    this.selectedItemIndex = index;

    if(this.listType === 'friends'){
      this.commonService.getConversationId(this.loggedUser.id,this.list[index].id).subscribe(value => {
        let obj = {
          'selectedItem':this.list[index],
          'itemType':this.listType,
          'conversationId':value
        }
        this.selectedItemEvent.emit(obj);
      })
    }else if(this.listType === 'chats'){
      this.commonService.getConversation(this.list[index].userIdFrom,this.list[index].userIdTo).subscribe(value => {
        let obj = {
          'selectedItem':this.list[index],
          'itemType':this.listType,
          'conversation':value
        }
        this.selectedItemEvent.emit(obj);
      })
    }else{
      let obj = {
        'selectedItem':this.list[index],
        'itemType':this.listType
      }
      this.selectedItemEvent.emit(obj);
    }
  }

  ngOnDestroy(){
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
