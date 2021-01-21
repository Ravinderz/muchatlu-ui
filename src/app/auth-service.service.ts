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

    // if(!localStorage.getItem('avatars')){
    //   this.getAvatarImg().subscribe(data => {
    //     console.log(data);
    //     this.avatars = data;
    //     localStorage.setItem('avatars',JSON.stringify(this.avatars));

    //   })
    // }else{
    //   this.avatars = JSON.parse(localStorage.getItem('avatars'));
    // }
  }

  // apikey = 'DE94E4AE-B7774FFF-9D379FD1-FBD35969';

  // getAvatarImg(){

  //   const httpHeaders: HttpHeaders = new HttpHeaders({
  //     'X-API-KEY': [this.apikey],
  //     'Accept': 'application/json',
  //     'Cache-Control': 'no-cache'
  // });

  //   return this.http.get("https://uifaces.co/api?limit=30",{ headers: httpHeaders });

  // }

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
