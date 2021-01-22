import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AppComponent } from './app.component';
import { AuthInterceptorService } from './auth-interceptor.service';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { FriendChatComponent } from './friend-chat/friend-chat.component';
import { FriendDetailsComponent } from './friend-details/friend-details.component';
import { FriendRequestDisplayComponent } from './friend-request-display/friend-request-display.component';
import { GroupListComponent } from './group-list/group-list.component';
import { HomeComponent } from './home/home.component';
import { ItemHeaderComponent } from './item-header/item-header.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegisterLoginComponent } from './register-login/register-login.component';
import { RegisterComponent } from './register/register.component';
import { RouteGuardService } from './route-guard.service';
import { SearchBoxComponent } from './search-box/search-box.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'home', canActivate: [RouteGuardService], component: HomeComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
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
    FriendDetailsComponent,
    UserProfileComponent,
    NotFoundComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSkeletonLoaderModule.forRoot()
  ],
  exports: [RouterModule],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
