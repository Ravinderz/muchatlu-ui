import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getFriends(user:any){
    return this.http.get(`${this.baseUrl}getAllFriends/${user.id}`);
  }

  sendFriendRequest(request:any){
    console.log("inside send requyest  :: ",request)
    return this.http.post(`${this.baseUrl}sendFriendRequest`,request);
  }

  updateFriendRequest(request:any){
    return this.http.post(`${this.baseUrl}updateFriendRequest`,request);
  }

  getFriendRequests(id:string){
    return this.http.get(`${this.baseUrl}getFriendRequests/${id}`);
  }

  getUserConversations(id:string){
    return this.http.get(`${this.baseUrl}getUserConversations/${id}`);
  }

}
