import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.baseUrl;

  public userLoginEvent : Subject<boolean> =new Subject<boolean>();

  public userLogoutEvent : Subject<boolean> =new Subject<boolean>();

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

  getUserDetails(value:string){
    return this.http.get(`${this.baseUrl}getUserDetails/${value}`);
  }

  updateUserDetails(value:any){
    return this.http.put(`${this.baseUrl}updateUserDetails`,value);
  }

  logout(user:any){
    return this.http.post(`${this.baseUrl}logoutUser`,{'id':user.id,'username':user.username});
  }

  getUserPresence(id:number){
    return this.http.get(`${this.baseUrl}getUserOnlinePresence/${id}`);
  }

}
