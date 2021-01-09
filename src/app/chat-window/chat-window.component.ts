import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {

  constructor(private authService:AuthService, private messageService:MessageService) { }

  @ViewChild('scrollTo',{static:true}) scrollTo: ElementRef;

  loggedUser:any;
  selectedChatId:any;
  selectedFriend:any;
  text:String;
  chats= {};
  
  friends = [{
    'id':1,
    'username':'Ravi',
    'email':'ravi@abc.com',
    'avatar':'https://images.pexels.com/photos/412840/pexels-photo-412840.jpeg?crop=faces&fit=crop&h=200&w=200&auto=compress&cs=tinysrgb'
  },
  {
    'id':3,
    'username':'Sindhu',
    'email':'sindhu@abc.com',
    'avatar':'https://images.unsplash.com/photo-1529218164294-0d21b06ea831?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
  },{
    'id':2,
    'username':'Bharath',
    'email':'bharath@abc.com',
    'avatar':'https://images.unsplash.com/photo-1542345812-d98b5cd6cf98?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
  }];

  ngOnInit() {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
    if(!this.selectedFriend){
      this.selectedFriend = this.friends[0];
    }
    console.log(this.loggedUser);
    this.messageService.getValue().subscribe((value) => {
      this.chats = value;
    });
  }  

  selectedUser(friend){
    console.log(friend);
    this.selectedFriend = friend;
    this.selectedChatId = friend.id;
    if(this.chats[friend.id]){

    }
    }

    sendMsg(el: HTMLElement){
      console.log(this.text);
      let msg = {
        'userIdFrom':this.loggedUser.id,
        'userIdTo':this.selectedChatId,
        'usernameFrom':this.loggedUser.username,
        'avatarFrom': this.loggedUser.avatar,
        'usernameTo':this.selectedFriend.username,
        'message':this.text
      }
      this.messageService.sendMessage(msg);
      this.text = '';
      this.scrollTo.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
      var elmnt = document.getElementById("scrollTo");
      elmnt.scrollIntoView();
    } 

}
