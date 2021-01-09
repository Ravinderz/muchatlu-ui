import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
    this.chats = new BehaviorSubject<any>({});
    this.initializeWebSocketConnection(this.loggedUser.id);
  }
  public stompClient;

  public chats : BehaviorSubject<any>;

  public msg = {
   
  };
  initializeWebSocketConnection(userId) {
    const serverUrl = 'http://localhost:8080/chat';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.setValue(this.msg);
    // tslint:disable-next-line:only-arrow-functions
    this.stompClient.connect({}, function(frame) {

      
      that.stompClient.subscribe(`/topic/${userId}/messages`, (message) => {
        console.log(message);
        if (message.body) {
          let msg = JSON.parse(message.body);
          that.msg = msg;
          console.log('inside stompClient :',userId,msg);
          console.log('user if from :',msg.userIdFrom);
          console.log(that.msg)
          if(that.msg[msg.userIdFrom]){
            that.msg[msg.userIdFrom].push(msg);
          }else{
            let arr = []
            arr.push(msg);
            that.msg[msg.userIdFrom] = arr;
          }
          that.setValue(that.msg);
          //that.msg.push(message.body);
        }
      });

      // that.stompClient.subscribe(`/topic/public`, (message) => {
      //   console.log(message);
      //   if (message.body) {
      //     let msg = JSON.parse(message.body);
      //     console.log('inside stompClient :',userId,msg);
      //     console.log('user if from :',msg.userIdFrom);
      //     console.log(that.msg)
      //     if(that.msg[msg.userIdFrom]){
      //       that.msg[msg.userIdFrom].push(msg);
      //     }else{
      //       let arr = []
      //       arr.push(msg);
      //       that.msg[msg.userIdFrom] = arr;
      //     }
      //     that.setValue(that.msg);
      //     //that.msg.push(message.body);
      //   }
      // });
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

  getValue(): Observable<any> {
    return this.chats.asObservable();
  }
  setValue(newValue): void {
    this.chats.next(newValue);
  }
}