import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  public friendChangeEvent : BehaviorSubject<any> = new BehaviorSubject<any>({});

  getConversationId(fromId,toId){
    return this.http.get(`http://localhost:8080/getConversationId/${fromId}/${toId}`);
  }

}
