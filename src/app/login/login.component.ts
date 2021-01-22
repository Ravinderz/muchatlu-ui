import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService, private router: Router) {
    this.screenWidth = window.innerWidth;
   }

  subscriptions: Subscription[] = [];
  public screenWidth: any;

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  })

  ngOnInit() {
  }

  login() {

    this.subscriptions.push(this.authService.authenticate(this.loginForm.value).subscribe((token) => {
      console.log(token);
      sessionStorage.setItem('token', JSON.stringify(token));
      if (token) {
        this.subscriptions.push(this.authService.login(this.loginForm.value).subscribe((data) => {
          console.log(data);
          sessionStorage.setItem('loggedUser', JSON.stringify(data));
          this.router.navigate(['home']);
        }));
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
