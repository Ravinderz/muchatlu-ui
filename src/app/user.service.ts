import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getFriends(user:any){
    return this.http.get(`http://localhost:8080/getAllFriends/${user.id}`);
  }

  sendFriendRequest(request:any){
    console.log("inside send requyest  :: ",request)
    return this.http.post(`http://localhost:8080/sendFriendRequest`,request);
  }

  updateFriendRequest(request:any){
    return this.http.post(`http://localhost:8080/updateFriendRequest`,request);
  }

  getFriendRequests(id:string){
    return this.http.get(`http://localhost:8080/getFriendRequests/${id}`);
  }

}
