import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-friend-request-display',
  templateUrl: './friend-request-display.component.html',
  styleUrls: ['./friend-request-display.component.scss']
})
export class FriendRequestDisplayComponent implements OnInit,OnChanges,OnDestroy{
  loggedUser: any;
  showActionBtn: any;
  constructor(private userService:UserService) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
   }


  @Input() selectedItem: any ;
  subscriptions:Subscription[] = [];

  ngOnInit() {


  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.selectedItem);

    if(this.selectedItem.requestFromUserId === this.loggedUser.id){
      if(this.selectedItem.status === 'Accepted' || this.selectedItem.status === 'Rejected'){
        this.showActionBtn = false;
      }
    }
    if(this.selectedItem.requestFromUserId !== this.loggedUser.id){
      if(this.selectedItem.status === 'Pending'){
        this.showActionBtn = true;
      }
    }
  }

  updateFriendRequest(status:string){
    this.selectedItem.status = status;
    console.log(this.selectedItem);
    this.subscriptions.push(this.userService.updateFriendRequest(this.selectedItem).subscribe((value) => {
    }));
  }

  ngOnDestroy(){
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
