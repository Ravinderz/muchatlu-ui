import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loggedUser:any;
  selectedChatId:any;
  selectedFriend:any;
  text:String;
  chats:any;
  email:string;
  subscriptions:Subscription[] = [];
  friends:any;

  friendRequests:any;

  unreadMessages:any = {};

  updatedFriends = new Set();

  //private messageService:MessageService
  constructor(private userService:UserService) { }

  activeLink: String = "chats";
  placeholder: String;
  list:any;
  listType:String = 'friend';
  selectedListItem: any;


  ngOnInit() {
    if(this.loggedUser){
      console.log("inside logged user :: ",this.loggedUser)
      this.subscriptions.push(this.userService.getFriends(this.loggedUser).subscribe( (value:any) => {

        console.log("friends ::: ",value)
        value.friends.forEach(element => {
          if(element && element != null && typeof element == 'object'){
                this.updatedFriends.add(element);
              }
        });
        this.friends = value.friends;
        if(!this.friends){
          this.friends = [];
        }
        if(!this.selectedFriend){
          this.selectedFriend = this.friends[0];
        }
      }));

      this.list = this.friends;
      this.listType = 'friend';
    }

    this.friends =of([{
      'id':1,
      'username':'Ravinder Singh',
      'email':'ravi@abc.com',
      'avatar':'./assets/images/44.jpg',
      'status':'This is my latest message',
      'isOnline':true
    },
    {
      'id':2,
      'username':'Bharath',
      'email':'ravi@abc.com',
      'avatar':'./assets/images/46.jpg',
      'status':'How do you thing this area is looking',
      'isOnline':true
    },
    {
      'id':3,
      'username':'Sindhu',
      'email':'ravi@abc.com',
      'avatar':'./assets/images/97.jpg',
      'status':'This app is going to be awesome',
      'isOnline':true
    }]);

    this.list = of(this.updatedFriends);

  }

  loadPage(name:String,e:any){
    e.preventDefault();
    this.activeLink = name;
    if(name === "chats"){
      console.log("load chats");
      this.placeholder = 'Search';
      this.list = this.friends;
      this.listType = 'friend';
    }
    if(name === "friends"){
      console.log("friends");
      this.placeholder = 'Search / Add friends';
      this.list = this.friends;
      this.listType = 'friend';
    }
    if(name === "friend requests"){
      console.log("friend requests");
      this.placeholder = 'Search / Add friends';
      this.list = this.friendRequests;
      this.listType = 'friend';
    }
    if(name === "groups"){
      console.log("groups");
      this.placeholder = 'Search';
      this.list = this.friends;
      this.listType = 'group';
    }
  }

  itemSelected(e:any){
    console.log(e)
    this.selectedListItem = e;
  }

  addFriend(value:any){

    if(value.requestFromUserId === this.loggedUser.id){
      if(value.requestToUser && value.requestToUser != null && typeof value.requestToUser == 'object'){
        this.updatedFriends.add(value.requestToUser);
      }
    }else if(value.requestToUserId === this.loggedUser.id){
      if(value.requestFromUser && value.requestFromUser != null && typeof value.requestFromUser == 'object'){
        this.updatedFriends.add(value.requestFromUser);
      }
    }
  }

}
