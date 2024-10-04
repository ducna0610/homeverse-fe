import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private userService: UserService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const token = this.userService.getToken();

    if (token !== '') {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    }

    return next.handle(request);
  }
}