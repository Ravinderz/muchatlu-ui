import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth-service.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService, private router: Router, private userService: UserService) {
    this.screenWidth = window.innerWidth;
   }

  subscriptions: Subscription[] = [];
  public screenWidth: any;
  
  message:string;

  loginForm = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',Validators.required),
  })

  submitted = false;

  ngOnInit() {
  }

  get f() { return this.loginForm.controls; }

  focus(){
    this.message = '';
    var elm = document.getElementById('email');
        elm.classList.remove('error-input');
        elm = document.getElementById('password');
        elm.classList.remove('error-input');
  }

  login() {
    this.submitted = true;
    console.log("inside console");
    this.clearSession();
    this.subscriptions.push(this.authService.authenticate(this.loginForm.value).subscribe((token) => {
      console.log(token);
      sessionStorage.setItem('token', JSON.stringify(token));
      if (token) {
        this.subscriptions.push(this.authService.login(this.loginForm.value).subscribe((data) => {
          console.log(data);
          sessionStorage.setItem('loggedUser', JSON.stringify(data));
          this.userService.userLoginEvent.next(true);
          this.router.navigate(['home']);
        },(err) => {
          if(err){
            console.log(err);
            this.message = err.error.message;
          }
        }));
      }
    },(err) => {
      if(err){
        console.log(err);
        this.message = err.error.message;

        var elm = document.getElementById('email');
        elm.classList.add('error-input');
        elm = document.getElementById('password');
        elm.classList.add('error-input');
      }
    }));
  }

  private clearSession() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('loggedUser');
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
