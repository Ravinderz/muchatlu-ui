import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];



  constructor(private authService: AuthService, private router: Router) { }

  registerForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    avatar: new FormControl(''),
    status: new FormControl(''),
  })

  ngOnInit() {
  }

  register() {

    this.subscriptions.push(this.authService.register(this.registerForm.value).subscribe((data) => {
      console.log(data);
      sessionStorage.setItem('loggedUser', JSON.stringify(data));
      this.router.navigate(['login']);
    }));
  }

  getRandomNum(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
