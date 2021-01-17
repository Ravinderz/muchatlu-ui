import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-friend-details',
  templateUrl: './friend-details.component.html',
  styleUrls: ['./friend-details.component.scss']
})
export class FriendDetailsComponent implements OnInit {


  constructor() {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
   }

  @Input() selectedItem: any;
  loggedUser: any;

  ngOnInit() {
  }

}
