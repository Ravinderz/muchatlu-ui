import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from '../message.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {

  constructor(private userService:UserService, private messageService:MessageService, ) { 
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }

  @ViewChild('scrollTo',{static:true}) scrollTo: ElementRef;

  loggedUser:any;
  selectedChatId:any;
  selectedFriend:any;
  text:String;
  chats= {};
  email:string;

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

//  {
//   'id':3,
//   'username':'Sindhu',
//   'email':'sindhu@abc.com',
//   'avatar':'https://images.unsplash.com/photo-1529218164294-0d21b06ea831?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
//   'isOnline':false
// },{
//   'id':2,
//   'username':'Bharath',
//   'email':'bharath@abc.com',
//   'avatar':'https://images.unsplash.com/photo-1542345812-d98b5cd6cf98?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
//   'isOnline':false
// }

  ngOnInit() {
    
    if(this.loggedUser){
      console.log("inside logged user :: ",this.loggedUser)
      this.userService.getFriends(this.loggedUser).subscribe( (value:any) => {

        value.friends.forEach(element => {
          this.updatedFriends.add(element);
        });
        
        value.friendsTo.forEach(element => {
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
      });
    }

    if(!this.selectedFriend){
      this.selectedFriend = this.friends[0];
    }
    
    console.log(this.loggedUser);
    this.messageService.getValue().subscribe((value) => {
      this.chats = value;
    });

    this.messageService.loginEvent.subscribe((value) =>{
      console.log("Inside chat window, login event value ::: ",value);
      //let updatedFriends = this.friends;
      this.friends.forEach(element => {
        if(element.id === value.userId){
          element.isOnline = value.online;
        }
      });

     // this.friends = updatedFriends;
    })

    this.messageService.logoutEvent.subscribe((value) =>{
      console.log("Inside chat window, login event value ::: ",value);
      //let updatedFriends = this.friends;
      this.friends.forEach(element => {
        if(element.id === value.userId){
          element.isOnline = value.online;
        }
      });

      //this.friends = updatedFriends;
    })

    this.messageService.friendRequestEvent.subscribe((value) =>{
      console.log("Inside chat window, friendRequest event value ::: ",value);

      console.log("friend requests :: ",this.friendRequests);
      //let updatedFriends = this.friends;
      if(value && value.requestFromUserId && value.status === 'PENDING'){
        this.friendRequests.push(value);
      }

      if(value.requestFromUser && value.status === 'ACCEPTED'){
        if(value.requestFromUserId === this.loggedUser.id){
          this.friends.push(value.requestToUser);
        }else if(value.requestToUserId === this.loggedUser.id){
          this.friends.push(value.requestFromUser);
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
      
    });
    
   
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
      this.userService.sendFriendRequest(friendRequest).subscribe((value) => {
        console.log(value);
      });
    }

    updateFriendRequest(status:String,request:any){
      request.status = status;
      console.log(request);
      this.userService.updateFriendRequest(request).subscribe((value) => {
        console.log(value);
      });
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
