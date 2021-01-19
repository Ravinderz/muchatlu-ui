import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-friend-details',
  templateUrl: './friend-details.component.html',
  styleUrls: ['./friend-details.component.scss']
})
export class FriendDetailsComponent implements OnInit {
  loggedUser: any;


  constructor() {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
   }

  @Input() selectedItem: any;
  @Output() startChatEvent = new EventEmitter<any>();

  ngOnInit() {
    
  }

  startChat(){
    this.startChatEvent.emit(this.selectedItem);
  }



}
