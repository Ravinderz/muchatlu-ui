import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  loggedUser: any;
  showStatusInput: boolean = false;
  status:string;
  constructor() { 
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }

  ngOnInit() {
  }

  toggleStatusEdit(){
    this.showStatusInput = !this.showStatusInput;
  }

  updateUserStatus(){
    console.log(this.status);
    sessionStorage.removeItem("loggedUser");
    this.loggedUser.status = this.status;
    sessionStorage.setItem("loggedUser",JSON.stringify(this.loggedUser));
    this.showStatusInput = !this.showStatusInput;
    
    

  }

}
