import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor() { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: any = JSON.parse(sessionStorage.getItem('token'));
    if (token) {
      req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token.token) });
    }
    return next.handle(req);
    // .pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     let errorMsg = '';
    //     if (error.error instanceof ErrorEvent) {
    //       console.log('this is client side error');
    //       errorMsg = `Error: ${error.error.message}`;
    //     }
    //     else {
    //       console.log('this is server side error');
    //       errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
    //     }
    //     console.log(errorMsg);
    //     return throwError(errorMsg);
    //   })
    // );
  }
}
