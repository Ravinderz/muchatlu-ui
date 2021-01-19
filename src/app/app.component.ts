import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loggedUser: any;
  
  constructor() {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }
}
