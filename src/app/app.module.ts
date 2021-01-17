import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { FriendChatComponent } from './friend-chat/friend-chat.component';
import { FriendRequestDisplayComponent } from './friend-request-display/friend-request-display.component';
import { GroupListComponent } from './group-list/group-list.component';
import { HomeComponent } from './home/home.component';
import { ItemHeaderComponent } from './item-header/item-header.component';
import { LoginComponent } from './login/login.component';
import { RegisterLoginComponent } from './register-login/register-login.component';
import { RegisterComponent } from './register/register.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { FriendDetailsComponent } from './friend-details/friend-details.component';

const routes: Routes = [
  { path: '',   redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',   component: LoginComponent },
  { path: 'signup',   component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'chat', component: ChatWindowComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    ChatWindowComponent,
    RegisterLoginComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    GroupListComponent,
    SearchBoxComponent,
    ItemHeaderComponent,
    FriendChatComponent,
    FriendRequestDisplayComponent,
    FriendDetailsComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
