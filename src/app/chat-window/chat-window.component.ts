import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../message.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit,OnDestroy {

  constructor(private userService:UserService, private messageService:MessageService, ) { 
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }

  @ViewChild('scrollTo',{static:true}) scrollTo: ElementRef;

  loggedUser:any;
  selectedChatId:any;
  selectedFriend:any;
  text:String;
  chats:any;
  email:string;
  subscriptions:Subscription[] = [];

  friendRequests = [];

  updatedFriends = new Set();
  
  friends = [{
    'id':1,
    'username':'Ravi',
    'email':'ravi@abc.com',
    'avatar':'https://images.pexels.com/photos/412840/pexels-photo-412840.jpeg?crop=faces&fit=crop&h=200&w=200&auto=compress&cs=tinysrgb',
    'isOnline':true
  },
 ];

  ngOnInit() {
    
    if(this.loggedUser){
      console.log("inside logged user :: ",this.loggedUser)
      this.subscriptions.push(this.userService.getFriends(this.loggedUser).subscribe( (value:any) => {

        console.log("friends ::: ",value)
        value.friends.forEach(element => {
          if(element && element != null && typeof element == 'object'){
                this.updatedFriends.add(element);
              }
        });
        this.friends = value.friends;
        if(!this.friends){
          this.friends = [];
        }
        if(!this.selectedFriend){
          this.selectedFriend = this.friends[0];
        }
      }));
    }

    if(!this.selectedFriend){
      this.selectedFriend = this.friends[0];
    }
    
    console.log(this.loggedUser);
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


      console.log(this.chats);
    }));

    this.subscriptions.push(this.messageService.loginEvent.subscribe((value) =>{
      console.log("Inside chat window, login event value ::: ",value);
      //let updatedFriends = this.friends;
      this.friends.forEach(element => {
        if(element.id === value.userId){
          element.isOnline = value.online;
        }
      });

     // this.friends = updatedFriends;
    }));

    this.subscriptions.push(this.messageService.logoutEvent.subscribe((value) =>{
      console.log("Inside chat window, login event value ::: ",value);
      //let updatedFriends = this.friends;
      this.friends.forEach(element => {
        if(element.id === value.userId){
          element.isOnline = value.online;
        }
      });

      //this.friends = updatedFriends;
    }));

    this.subscriptions.push(this.messageService.friendRequestEvent.subscribe((value) =>{
      console.log("Inside chat window, friendRequest event value ::: ",value);      
      //let updatedFriends = this.friends;
      if(value && value.requestFromUserId && value.status === 'PENDING'){
        this.friendRequests.push(value);
      }

      if(value.requestFromUser && value.status === 'ACCEPTED'){
        console.log("isndie accepted status ::::: ",value)
        console.log("isndie accepted status logged user ::::: ",this.loggedUser)
        if(value.requestFromUserId === this.loggedUser.id){ 
          if(value.requestToUser && value.requestToUser != null && typeof value.requestToUser == 'object'){
            this.updatedFriends.add(value.requestToUser);
          }
        }else if(value.requestToUserId === this.loggedUser.id){
          if(value.requestFromUser && value.requestFromUser != null && typeof value.requestFromUser == 'object'){
            this.updatedFriends.add(value.requestFromUser);
          }
        }
        this.friendRequests.forEach((element,index)=>{
          if(element.id===value.id) {
            this.friendRequests.splice(index,1);
          }
       });
      }

      if(value && value.status === 'REJECTED'){
        console.log('sindie rejectred  ... ',this.friendRequests);
        this.friendRequests.forEach((element,index)=>{
          if(element.id===value.id) {
            this.friendRequests.splice(index,1);
          }
       });
      }
      
    }));
    
   
  }  

  selectedUser(friend){
    console.log(friend);
    this.selectedFriend = friend;
    this.selectedChatId = friend.id;
    if(this.chats[friend.id]){

    }
    }

    acceptRequest(){
      console.log('request accepted');
    }

    sendFriendRequest(){
      let friendRequest = {
      'status':'PENDING',
      'requestFromUserId':this.loggedUser.id,
      'requestToEmailId':this.email,
      'requestFromUsername':this.loggedUser.username
      }
      console.log(friendRequest);
      this.subscriptions.push(this.userService.sendFriendRequest(friendRequest).subscribe((value) => {
      }));
    }

    updateFriendRequest(status:String,request:any){
      request.status = status;
      console.log(request);
      this.subscriptions.push(this.userService.updateFriendRequest(request).subscribe((value) => {
      }));
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
      if(!this.chats){
        this.chats = {};
      }
      if(!this.chats[msg.userIdTo]){
        this.chats[msg.userIdTo]= [msg];
      }else{
        this.chats[msg.userIdTo].push(msg);
      }
      
      this.text = '';
      this.scrollTo.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
      var elmnt = document.getElementById("scrollTo");
      elmnt.scrollIntoView();
    } 

    ngOnDestroy(){
      this.subscriptions.forEach(s => s.unsubscribe());
    }

}
