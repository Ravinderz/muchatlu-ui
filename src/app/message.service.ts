import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth-service.service';
declare var SockJS;
declare var Stomp;
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl = environment.baseUrl;

  loggedUser:any;

  constructor(private authService:AuthService) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
    this.initializeWebSocketConnection(this.loggedUser.id);
  }
  public stompClient;

  public messageEvent : BehaviorSubject<any> = new BehaviorSubject<any>({});

  public typingEvent : BehaviorSubject<any> = new BehaviorSubject<any>({});

  public loginEvent : BehaviorSubject<any> =new BehaviorSubject<any>({});

  public logoutEvent : BehaviorSubject<any> =new BehaviorSubject<any>({});

  public friendRequestEvent : BehaviorSubject<any> =new BehaviorSubject<any>({});

  initializeWebSocketConnection(userId) {
    const serverUrl = `${this.baseUrl}chat?userId=${userId}`;
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    this.stompClient.connect({"userId": `${userId}`}, function(frame) {

      console.log(frame);
      that.stompClient.subscribe(`/topic/${userId}/messages`, (message) => {
        console.log(message);
        if (message.body) {
          let msg = JSON.parse(message.body);
          that.messageEvent.next(msg);
        }
      });

      that.stompClient.subscribe(`/topic/${userId}/messages.typing`, (message) => {
        console.log(message);
        if (message.body) {
          let msg = JSON.parse(message.body);
          that.typingEvent.next(msg);
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
  }

  isTyping(message) {
    this.stompClient.send(`/app/chat.typing.${message.userIdTo}` , {}, JSON.stringify(message));
  }

}
