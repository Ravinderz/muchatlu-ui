import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.baseUrl;

  user:any;
  avatars:any;
  imgPath = "./../../assets/avatars/";

  constructor(private http: HttpClient){

  }

  
  randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  register(user:any){
    user.avatar = this.imgPath+"cats_"+this.randomIntFromInterval(1,33)+".jpg";
    user.status = "Hi! I am available.";
    console.log(user);
    return this.http.post(`${this.baseUrl}register`,user);
  }

  login(user:any){
    return this.http.post(`${this.baseUrl}login`,user);
  }

  authenticate(user:any){
    return this.http.post(`${this.baseUrl}authenticate`,user);
  }

  getUser(){
    return this.user;
  }

  setUser(user){
    this.user = user;
  }

}
