import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from './common.service';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  loggedUser: any;
  showAvatar: boolean = false;
  showProfile: boolean = false;
  subscriptions: Subscription[] = [];

  constructor(private commonService: CommonService, private userService: UserService) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }
  ngOnInit(){
    this.subscriptions.push(this.userService.userLoginEvent.subscribe((value) => {    
      console.log(value) ;
      this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
      this.showAvatar = value;
    }));

    this.subscriptions.push(this.userService.userLogoutEvent.subscribe((value) => {      
      console.log(value) ;
      this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser')); 
      this.showAvatar = value;
    }));
  }

  showProfileSection() {
    this.showProfile = !this.showProfile;
    this.commonService.showProfileEvent.next(this.showProfile);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
