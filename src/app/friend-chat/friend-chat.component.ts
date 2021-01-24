import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-friend-chat',
  templateUrl: './friend-chat.component.html',
  styleUrls: ['./friend-chat.component.scss']
})
export class FriendChatComponent implements OnInit, OnChanges, OnDestroy {

  @Input() selectedItem: any;
  @Input() conversationId: any;
  @Input() conversation: any;

  subscriptions: Subscription[] = [];
  selectedChatId: any;
  unreadMessages: any = {};
  text: any;
  loggedUser: any;
  isTyping: boolean = false;

  constructor(private messageService: MessageService) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }
  ngOnChanges(changes: SimpleChanges): void {

    var elem = document.getElementById('empty-div');
    if (elem) {
      setTimeout(() => {
        elem.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
      }, 10);
    } else {
      setTimeout(() => {
        elem = document.getElementById('empty-div');
        elem.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
      }, 10);
    }

  }

  ngOnInit() {
    this.subscriptions.push(this.messageService.messageEvent.subscribe((value) => {
      if (this.conversation) {
        if (!this.isEmpty(value)) {
          if (this.conversation.message[this.conversation.message.length - 1].id !== value.id) {
            this.conversation.message.push(value);
            setTimeout(() => {
              let elem = document.getElementById('empty-div');
              elem.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
            }, 10);
          }
        }
      }

      if (value.userIdFrom !== this.selectedChatId) {
        if (!this.unreadMessages[value.userIdFrom]) {
          this.unreadMessages[value.userIdFrom] = [1];
        } else {
          this.unreadMessages[value.userIdFrom].push(1);
        }
      }
    }));

    this.subscriptions.push(this.messageService.typingEvent.subscribe((value) => {
      if (this.conversation) {
        if (!this.isEmpty(value)) {
          if (this.conversation.id === value.conversationId) {
            if (this.loggedUser.id !== value.userIdFrom) {
              this.isTyping = value.isTyping;
            } else {
              this.isTyping = value.isTyping;
            }
            setTimeout(() => {
              let elem = document.getElementById('empty-div');
              elem.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
            }, 10);
          }
        }
      }


    }));
  }

  isEmpty(obj: any) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }
    return true;
  }

  sendMessage() {
    console.log(this.text);
    if (!this.text) {
      return;
    }
    if (this.text && this.text.trim() === "") {
      return;
    }

    let msg;
    if (this.loggedUser.id === this.selectedItem.userIdFrom) {
      msg = {
        'userIdFrom': this.loggedUser.id,
        'userIdTo': this.selectedItem.userIdTo,
        'usernameFrom': this.loggedUser.username,
        'avatarFrom': this.loggedUser.avatar,
        'usernameTo': this.selectedItem.usernameTo,
        'avatarTo': this.selectedItem.avatarTo,
        'message': this.text.trim(),
        'conversationId': this.selectedItem.id,
        'timestamp': new Date().toISOString()
      }
    } else {
      msg = {
        'userIdFrom': this.loggedUser.id,
        'userIdTo': this.selectedItem.userIdFrom,
        'usernameFrom': this.loggedUser.username,
        'avatarFrom': this.loggedUser.avatar,
        'usernameTo': this.selectedItem.usernameFrom,
        'avatarTo': this.selectedItem.avatarFrom,
        'message': this.text.trim(),
        'conversationId': this.selectedItem.id,
        'timestamp': new Date().toISOString()
      }
    }

    this.messageService.sendMessage(msg);
    console.log(msg);
    if (this.conversation) {
      this.conversation.message.push(msg)
    }
    this.text = '';
    this.typing();
    var elem = document.getElementById('empty-div');
    setTimeout(() => {
      elem.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }, 10);
  }

  typing() {
    let msg;

    if (this.loggedUser.id === this.selectedItem.userIdFrom) {
      msg = {
        'userIdFrom': this.loggedUser.id,
        'userIdTo': this.selectedItem.userIdTo,
        'isTyping': true,
        'conversationId': this.selectedItem.id,

      }
    } else {
      msg = {
        'userIdFrom': this.loggedUser.id,
        'userIdTo': this.selectedItem.userIdFrom,
        'isTyping': true,
        'conversationId': this.selectedItem.id,
      }
    }

    if (this.text && this.text !== '') {
      msg.isTyping = true;
    } else {
      msg.isTyping = false;
    }

    this.messageService.isTyping(msg);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
