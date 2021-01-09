import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-register-login',
  templateUrl: './register-login.component.html',
  styleUrls: ['./register-login.component.css']
})
export class RegisterLoginComponent implements OnInit {

  

  constructor(private authService: AuthService,private router: Router) { }

  registerForm = new FormGroup({
    username : new FormControl(''),
    email : new FormControl(''),
    password : new FormControl(''),
    repassword : new FormControl(''),
    avatar: new FormControl('')
  })

  loginForm = new FormGroup({
    email : new FormControl(''),
    password : new FormControl(''),
  })
  

  login: boolean = false;
  ngOnInit() {
  }

  loadOtherSection(){
    this.login = !this.login;
  }

  onRegisterSubmit(){


    this.authService.register(this.registerForm.value).subscribe((data) => {
      console.log(data);
      sessionStorage.setItem('loggedUser', JSON.stringify(data));
      this.loadOtherSection();
    })
  }

  onLoginSubmit(){
    this.authService.login(this.loginForm.value).subscribe((data) => {
      console.log(data);
      sessionStorage.setItem('loggedUser', JSON.stringify(data));
      this.router.navigate(['chat']);
    })
  }


}
