import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-item-header',
  templateUrl: './item-header.component.html',
  styleUrls: ['./item-header.component.scss']
})
export class ItemHeaderComponent implements OnInit, OnChanges {
  loggedUser: any;

  constructor(private messageService: MessageService) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  @Input() selectedItem: any;
  subscriptions: Subscription[] = [];

  ngOnInit() {

    
    this.subscriptions.push(this.messageService.loginEvent.subscribe((value) => {

      console.log("inside lgoin event in item header",value);

      if (this.selectedItem.userIdTo === value.userId) {
        this.selectedItem['isUserToOnline'] = value.online;
      }

      if(this.selectedItem.userIdFrom === value.userId){
        this.selectedItem['isUserFromOnline'] = value.online;
      }

    }));

    this.subscriptions.push(this.messageService.logoutEvent.subscribe((value) => {


      console.log("inside logout event in item header",value);

      if (this.selectedItem.userIdTo === value.userId) {
        this.selectedItem['isUserToOnline'] = value.online;
      }

      if(this.selectedItem.userIdFrom === value.userId){
        this.selectedItem['isUserFromOnline'] = value.online;
      }

    }));
  }

}
