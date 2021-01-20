import { Component } from '@angular/core';
import { CommonService } from './common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loggedUser: any;

  showProfile: boolean = false;

  constructor(private commonService: CommonService) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }

  showProfileSection() {
    this.showProfile = !this.showProfile;
    this.commonService.showProfileEvent.next(this.showProfile);
  }

}
