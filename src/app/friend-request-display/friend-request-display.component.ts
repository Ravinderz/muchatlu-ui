import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-friend-request-display',
  templateUrl: './friend-request-display.component.html',
  styleUrls: ['./friend-request-display.component.scss']
})
export class FriendRequestDisplayComponent implements OnInit {

  constructor(private userService:UserService) { }

  @Input() selectedItem: any ;
  subscriptions:Subscription[] = [];

  ngOnInit() {
    console.log(this.selectedItem)
  }

  updateFriendRequest(status:string){
    this.selectedItem.status = status;
    console.log(this.selectedItem);
    this.subscriptions.push(this.userService.updateFriendRequest(this.selectedItem).subscribe((value) => {
    }));
  }
}
