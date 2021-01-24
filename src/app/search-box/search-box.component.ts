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
  @Output() friendRequestSentEvent = new EventEmitter<any>();
  loggedUser: any;
  email: any;
  subscriptions: Subscription[] = [];
  friendRequests = [];
  message: any;
  errorMessage: string;


  constructor(private userService: UserService) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }

  inputText: string;

  ngOnInit() {
    this.placeholder = 'Search'
    // this.subscriptions.push(this.userService.getUserDetails('b@abc.com').subscribe((value) => {
    //   console.log(value);
    // }));
  }

  sendFriendRequest() {
    if (this.email === this.friendRequests[this.friendRequests.length - 1]) {
      return;
    }

    if(this.email === this.loggedUser.email){
      this.errorMessage = "Friend request can't be sent to self";
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000);
      return;
    }
    let friendRequest = {
      'status': 'Pending',
      'requestFromUserId': this.loggedUser.id,
      'requestToEmailId': this.email,
      'requestFromUsername': this.loggedUser.username,
      'requestToUsername': '',
      'requestToUserId': '',
      'avatarTo': '',
      'avatarFrom': this.loggedUser.avatar
    }
    console.log(friendRequest);
    this.friendRequests.push(this.email);



    this.subscriptions.push(this.userService.getUserDetails(this.email).subscribe((value: any) => {
      console.log(value);
      if (value.id) {
        friendRequest.requestToUsername = value.username;
        friendRequest.avatarTo = value.avatar;
        friendRequest.requestToUserId = value.id;
        console.log(friendRequest);
        this.subscriptions.push(this.userService.sendFriendRequest(friendRequest).subscribe((request) => {
          if (request) {
            this.message = `Friend Request to ${value.username} sent successfully`;
            console.log(request);
            this.email = '';
            this.friendRequestSentEvent.emit(request);
            setTimeout(() => {
              this.message = null;
            }, 5000);
          }
        },(err:any) => {
          console.log(err);
          this.errorMessage = err.error.message;
          setTimeout(() => {
            this.errorMessage = null;
          }, 5000);
        }));
      } else {
        this.errorMessage = "User doesn't exist";
        setTimeout(() => {
          this.errorMessage = null;
        }, 5000);
      }

    }, (err:any) => {
      console.log(err);
      this.errorMessage = err.message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000);
    }));


  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
