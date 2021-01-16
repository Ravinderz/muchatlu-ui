import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-friend-chat',
  templateUrl: './friend-chat.component.html',
  styleUrls: ['./friend-chat.component.scss']
})
export class FriendChatComponent implements OnInit {

  @Input() selectedItem: any;

  subscriptions:Subscription[] = [];
  chats: any;
  selectedChatId: any;
  unreadMessages:any = {};
  loggedInId = 1;
  text:any;
  loggedUser: any;



  constructor(private messageService:MessageService) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }

  ngOnInit() {
    console.log(this.selectedItem);

    this.subscriptions.push(this.messageService.messageEvent.subscribe((value) =>{
      console.log("Inside chat window, message event value ::: ",value);
      value.timestamp = new Date(value.timestamp).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
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



    //   console.log(this.chats);
     }));
  }

  sendMessage(){
    console.log(this.text);
    if(!this.text){
      return;
    }
    if(this.text && this.text === ""){
      return;
    }
    let msg = {
      'userIdFrom':this.loggedUser.id,
      'userIdTo':this.selectedItem.id,
      'usernameFrom':this.loggedUser.username,
      'avatarFrom': this.loggedUser.avatar,
      'usernameTo':this.selectedItem.username,
      'message':this.text,
      'timestamp':null
    }
    this.messageService.sendMessage(msg);
    msg.timestamp = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    console.log(msg);
    if(!this.chats){
      this.chats = {};
    }
    if(!this.chats[msg.userIdTo]){
      this.chats[msg.userIdTo]= [msg];
    }else{
      this.chats[msg.userIdTo].push(msg);
    }
    this.text = '';
    var elmnt = document.getElementById("empty-div");
    elmnt.scrollIntoView();

  }

}
