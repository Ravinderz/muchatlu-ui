import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit, OnDestroy {

  @Input() placeholder: String;
  @Output() friendRequestSentEvent  = new EventEmitter<any>();
  loggedUser: any;
  email: any;
  subscriptions:Subscription[] = [];
  friendRequests = [];
  message:any;


  constructor(private userService:UserService) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }

  inputText:string;

  ngOnInit() {
    this.placeholder = 'Search'
    this.subscriptions.push(this.userService.getUserDetails('b@abc.com').subscribe((value) => {
      console.log(value);
    }));
  }

  sendFriendRequest(){
    if(this.email === this.friendRequests[this.friendRequests.length-1]){
      return;
    }
    let friendRequest = {
    'status':'Pending',
    'requestFromUserId':this.loggedUser.id,
    'requestToEmailId':this.email,
    'requestFromUsername':this.loggedUser.username,
    'requestToUsername':'',
    'requestToUserId':'',
    'avatarTo':'',
    'avatarFrom':this.loggedUser.avatar
    }
    console.log(friendRequest);
    this.friendRequests.push(this.email);



    this.subscriptions.push(this.userService.getUserDetails(this.email).subscribe((value:any) => {
      console.log(value);
    friendRequest.requestToUsername = value.username;
    friendRequest.avatarTo = value.avatar;
    friendRequest.requestToUserId = value.id;
    console.log(friendRequest);
    this.subscriptions.push(this.userService.sendFriendRequest(friendRequest).subscribe((value) => {
      if(value){
        this.message = "Friend request sent";
        console.log(value);
        this.friendRequestSentEvent.emit(value);
      }
    }));
    }));


  }

  ngOnDestroy(){
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
