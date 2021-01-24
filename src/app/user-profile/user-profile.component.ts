import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  loggedUser: any;
  showStatusInput: boolean = false;
  status: string;
  constructor(private userService: UserService,private route:Router) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }

  ngOnInit() {
  }

  toggleStatusEdit() {
    this.showStatusInput = !this.showStatusInput;
  }

  updateUserStatus() {
    console.log(this.status);
    sessionStorage.removeItem("loggedUser");
    this.loggedUser.status = this.status;
    this.userService.updateUserDetails(this.loggedUser).subscribe((value) => {
      sessionStorage.setItem("loggedUser", JSON.stringify(this.loggedUser));
      this.showStatusInput = !this.showStatusInput;
    })

  }

  logout(){
    this.userService.logout(this.loggedUser).subscribe((value) => {
      if(value){
        sessionStorage.removeItem("loggedUser");
        sessionStorage.removeItem("token");
        this.userService.userLogoutEvent.next(false);
        this.route.navigate(['login']);
      }
    })
  }

}
