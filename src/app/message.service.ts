import { Injectable } from '@angular/core';
declare var SockJS;
declare var Stomp;
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(userId ) {
    this.initializeWebSocketConnection(userId);
  }
  public stompClient;
  public msg = [];
  initializeWebSocketConnection(userId) {
    const serverUrl = 'http://localhost:8080/chat';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe(`/topic/messages/${userId}`, (message) => {
        if (message.body) {
          that.msg.push(message.body);
        }
      });
    });
  }

  sendMessage(message) {
    this.stompClient.send(`/app/chat/${message.userId}` , {}, message);
  }
}