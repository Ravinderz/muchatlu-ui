import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-friend-chat',
  templateUrl: './friend-chat.component.html',
  styleUrls: ['./friend-chat.component.scss']
})
export class FriendChatComponent implements OnInit {

  @Input() selectedItem: any;

  subscriptions:Subscription[] = [];
  messageService: any;
  chats: any;
  selectedChatId: any;
  unreadMessages:any = {};
  loggedInId = 1;



  constructor() { }

  ngOnInit() {
    console.log(this.selectedItem);
    this.chats={
      1:[{
        'id':1,
        'userIdTo':1,
        'userIdFrom':2,
        'message':'This is a really long message how about it',
        'time':'10:30 PM'
      },
      {
        'id':2,
        'userIdTo':2,
        'userIdFrom':1,
        'message':'another message',
        'time':'10:30 PM'
      },
      {
        'id':3,
        'userIdTo':2,
        'userIdFrom':1,
        'message':'how is this going to be',
        'time':'10:30 PM'
      },
      {
        'id':4,
        'userIdTo':1,
        'userIdFrom':2,
        'message':'I am awesome',
        'time':'10:30 PM'
      },
      {
        'id':5,
        'userIdTo':1,
        'userIdFrom':2,
        'message':'neo armstrong cyclone jet armstrong cannon',
        'time':'10:30 PM'
      },
      {
        'id':6,
        'userIdTo':2,
        'userIdFrom':1,
        'message':'gintama',
        'time':'10:30 PM'
      },]
    }

    this.subscriptions.push(this.messageService.messageEvent.subscribe((value) =>{
      console.log("Inside chat window, message event value ::: ",value);
      if(!this.chats){
        this.chats = {}
      }
      if(!this.chats[value.userIdTo]){
        this.chats[value.userIdTo]= [value];
      }else{
        this.chats[value.userIdTo].push(value);
      }

      if(!this.chats[value.userIdFrom]){
        this.chats[value.userIdFrom]= [value];
      }else{
        this.chats[value.userIdFrom].push(value);
      }

      if(value.userIdFrom !== this.selectedChatId){
        if(!this.unreadMessages[value.userIdFrom]){
          this.unreadMessages[value.userIdFrom]= [1];
        }else{
          this.unreadMessages[value.userIdFrom].push(1);
        }
      }



      console.log(this.chats);
    }));
  }

}
