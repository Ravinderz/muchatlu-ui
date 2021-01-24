import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../message.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-friend-request-display',
  templateUrl: './friend-request-display.component.html',
  styleUrls: ['./friend-request-display.component.scss']
})
export class FriendRequestDisplayComponent implements OnInit, OnChanges, OnDestroy {
  loggedUser: any;
  showActionBtn: any;
  constructor(private userService: UserService, private messageService: MessageService) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }


  @Input() selectedItem: any;
  subscriptions: Subscription[] = [];

  ngOnInit() {

    this.subscriptions.push(this.messageService.loginEvent.subscribe((value) => {

      if (this.selectedItem.requestToUserId === value.userId) {
        this.selectedItem['isOnline'] = value.online;
      }

      if(this.selectedItem.requestFromUserId === value.userId){
        this.selectedItem['isOnline'] = value.online;
      }

    }));

    this.subscriptions.push(this.messageService.logoutEvent.subscribe((value) => {

      if (this.selectedItem.requestToUserId === value.userId) {
        this.selectedItem['isOnline'] = value.online;
      }

      if(this.selectedItem.requestFromUserId === value.userId){
        this.selectedItem['isOnline'] = value.online;
      }

    }));


  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.selectedItem);
    console.log(changes);

    if (this.selectedItem && this.selectedItem.id) {
      if (this.selectedItem.requestFromUserId === this.loggedUser.id) {
        if (this.selectedItem.status === 'Accepted' || this.selectedItem.status === 'Rejected') {
          this.showActionBtn = false;
        }
      }
      if (this.selectedItem.requestFromUserId !== this.loggedUser.id) {
        if (this.selectedItem.status === 'Pending') {
          this.showActionBtn = true;
        }
      }
    }

    // if (changes.currentValue) {
    //   let obj: any = changes.currentValue;
    //   if (obj.requestFromUserId === this.loggedUser.id) {
    //     if (this.selectedItem.status === 'Accepted' || this.selectedItem.status === 'Rejected') {
    //       this.showActionBtn = false;
    //     }
    //   }
    //   if (obj.requestFromUserId !== this.loggedUser.id) {
    //     if (this.selectedItem.status === 'Pending') {
    //       this.showActionBtn = true;
    //     }
    //   }
    // }

  }

  updateFriendRequest(status: string) {
    this.selectedItem.status = status;
    console.log(this.selectedItem);

    this.subscriptions.push(this.userService.updateFriendRequest(this.selectedItem).subscribe((value) => {
      this.showActionBtn = false;
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
