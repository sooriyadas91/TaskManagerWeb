import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const creds = this.auth.getCredentials();
    if (creds) {
      const authHeader = 'Basic ' + btoa(`${creds.username}:${creds.password}`);
      const authReq = req.clone({
        setHeaders: { Authorization: authHeader }
      });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}
