import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {

  @Input() placeholder: String;
  loggedUser: any;
  email: any;
  subscriptions:Subscription[] = [];
  friendRequests


  constructor(private userService:UserService) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }

  inputText:string;

  ngOnInit() {
    this.placeholder = 'Search'
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

}
