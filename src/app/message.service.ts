import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth-service.service';
declare var SockJS;
declare var Stomp;
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  loggedUser:any;

  constructor(private authService:AuthService) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
    this.initializeWebSocketConnection(this.loggedUser.id);
  }
  public stompClient;

  public messageEvent : BehaviorSubject<any> = new BehaviorSubject<any>({});

  public loginEvent : BehaviorSubject<any> =new BehaviorSubject<any>({});

  public logoutEvent : BehaviorSubject<any> =new BehaviorSubject<any>({});

  public friendRequestEvent : BehaviorSubject<any> =new BehaviorSubject<any>({});

  public msg = {
   
  };
  initializeWebSocketConnection(userId) {
    const serverUrl = `http://localhost:8080/chat?userId=${userId}`;
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    this.stompClient.connect({}, function(frame) {

      
      that.stompClient.subscribe(`/topic/${userId}/messages`, (message) => {
        console.log(message);
        if (message.body) {
          let msg = JSON.parse(message.body);
          that.msg = msg;
          that.messageEvent.next(msg);
        }
      });

      
      that.stompClient.subscribe(`/topic/public.login`, (message) => {
        if (message.body) {
          let msg = JSON.parse(message.body);
          that.loginEvent.next(msg);
          console.log('inside loginevent : ' ,msg);
        }
      });

      that.stompClient.subscribe(`/topic/public.logout`, (message) => {
        if (message.body) {
          let msg = JSON.parse(message.body);
          that.logoutEvent.next(msg);
          console.log('inside logout event : ',msg);
        }
      });

      that.stompClient.subscribe(`/topic/${userId}.friendRequest`, (message) => {
        console.log(message);
        if (message.body) {
          let msg = JSON.parse(message.body);
          that.friendRequestEvent.next(msg);
          console.log('inside Friend Request event : ',msg);
        }
      });


    });
  }

  sendMessage(message) {
    this.stompClient.send(`/app/chat.${message.userIdTo}` , {}, JSON.stringify(message));
    if(this.msg[message.userIdTo]){
      this.msg[message.userIdTo].push(message);
    }else{
      let arr = []
      arr.push(message);
      this.msg[message.userIdTo] = arr;
    }
    
    //this.setValue(this.msg);
  }

}