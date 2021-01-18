import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit, OnDestroy {

  @Input() placeholder: String;
  loggedUser: any;
  email: any;
  subscriptions:Subscription[] = [];
  friendRequests = [];


  constructor(private userService:UserService) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }

  inputText:string;

  ngOnInit() {
    this.placeholder = 'Search'
  }

  sendFriendRequest(){
    if(this.email === this.friendRequests[this.friendRequests.length-1]){
      return;
    }
    let friendRequest = {
    'status':'Pending',
    'requestFromUserId':this.loggedUser.id,
    'requestToEmailId':this.email,
    'requestFromUsername':this.loggedUser.username
    }
    console.log(friendRequest);
    this.friendRequests.push(this.email);
    this.subscriptions.push(this.userService.sendFriendRequest(friendRequest).subscribe((value) => {
    }));
  }

  ngOnDestroy(){
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
