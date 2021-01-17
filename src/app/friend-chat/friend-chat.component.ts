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
  @Input() conversationId: any;
  @Input() conversation: any;

  subscriptions:Subscription[] = [];
  selectedChatId: any;
  unreadMessages:any = {};
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

      if(this.conversation){
        this.conversation.message.push(value)
      }

      if(value.userIdFrom !== this.selectedChatId){
        if(!this.unreadMessages[value.userIdFrom]){
          this.unreadMessages[value.userIdFrom]= [1];
        }else{
          this.unreadMessages[value.userIdFrom].push(1);
        }
      }
     }));
  }

  sendMessage(){
    console.log(this.text);
    if(!this.text){
      return;
    }
    if(this.text && this.text.trim() === ""){
      return;
    }

    let msg;
    if(this.loggedUser.id === this.selectedItem.userIdFrom){
       msg = {
        'userIdFrom':this.loggedUser.id,
        'userIdTo':this.selectedItem.userIdTo,
        'usernameFrom':this.loggedUser.username,
        'avatarFrom': this.loggedUser.avatar,
        'usernameTo':this.selectedItem.usernameTo,
        'avatarTo':this.selectedItem.avatarTo,
        'message':this.text.trim(),
        'conversationId':this.selectedItem.id,
        'timestamp':null
      }
    }else{
      msg = {
        'userIdFrom':this.loggedUser.id,
        'userIdTo':this.selectedItem.userIdFrom,
        'usernameFrom':this.loggedUser.username,
        'avatarFrom': this.loggedUser.avatar,
        'usernameTo':this.selectedItem.usernameFrom,
        'avatarTo':this.selectedItem.avatarFrom,
        'message':this.text.trim(),
        'conversationId':this.selectedItem.id,
        'timestamp':null
      }
    }


    this.messageService.sendMessage(msg);
    msg.timestamp = new Date();
    console.log(msg);
    // if(!this.chats){
    //   this.chats = {};
    // }
    // if(!this.chats[msg.userIdTo]){
    //   this.chats[msg.userIdTo]= [msg];
    // }else{
    //   this.chats[msg.userIdTo].push(msg);
    // }
    if(this.conversation){
      this.conversation.message.push(msg)
    }
    this.text = '';
    var elmnt = document.getElementById("empty-div");
    elmnt.scrollIntoView();

  }

}
