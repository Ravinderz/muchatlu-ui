import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

  @Input() list: any;
  @Input() listType: string;

  @Output() selectedItemEvent = new EventEmitter<any>();
  @Output() friendRequestEvent = new EventEmitter<any>();

  constructor(private messageService:MessageService) { }

  loggedUser:any;
  selectedItemIndex: string = null;
  subscriptions:Subscription[] = [];

  ngOnInit() {
    console.log(this.list);

    this.subscriptions.push(this.messageService.friendRequestEvent.subscribe((value) =>{
      console.log("Inside chat window, friendRequest event value ::: ",value);
      //let updatedFriends = this.friends;
      if(value && value.requestFromUserId && value.status === 'PENDING'){
        this.list.push(value);
      }

      if(value.requestFromUser && value.status === 'ACCEPTED'){
        console.log("isndie accepted status ::::: ",value)
        console.log("isndie accepted status logged user ::::: ",this.loggedUser)
        if(value.requestFromUserId === this.loggedUser.id){
          if(value.requestToUser && value.requestToUser != null && typeof value.requestToUser == 'object'){
            this.friendRequestEvent.emit(value.requestToUser);
            //this.updatedFriends.add(value.requestToUser);
          }
        }else if(value.requestToUserId === this.loggedUser.id){
          if(value.requestFromUser && value.requestFromUser != null && typeof value.requestFromUser == 'object'){
            this.friendRequestEvent.emit(value.requestFromUser);
            //this.updatedFriends.add(value.requestFromUser);
          }
        }
        this.list.forEach((element,index)=>{
          if(element.id===value.id) {
            this.list.splice(index,1);
          }
       });
      }

      if(value && value.status === 'REJECTED'){
        console.log('sindie rejectred  ... ',this.list);
        this.list.forEach((element,index)=>{
          if(element.id===value.id) {
            this.list.splice(index,1);
          }
       });
      }

    }));

  }

  selectedItem(index:any){
    this.selectedItemIndex = index;
    this.selectedItemEvent.emit(this.list[index]);
  }
}
