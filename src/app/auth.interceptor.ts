import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((err) => {
        if (err.status === 401) {
          return this.authService.refreshToken().pipe(
            switchMap((response: any) => {
              localStorage.setItem('access_token', response.access);
              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.access}`,
                },
              });
              return next.handle(clonedReq);
            })
          );
        }
        return throwError(err);
      })
    );
  }
}
