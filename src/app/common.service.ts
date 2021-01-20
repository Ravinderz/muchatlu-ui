import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public friendChangeEvent : BehaviorSubject<any> = new BehaviorSubject<any>({});

  public showProfileEvent : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  getConversationId(fromId,toId){
    return this.http.get(`${this.baseUrl}getConversationId/${fromId}/${toId}`);
  }

  getConversation(fromId,toId){
    return this.http.get(`${this.baseUrl}getConversation/${fromId}/${toId}`);
  }


}
