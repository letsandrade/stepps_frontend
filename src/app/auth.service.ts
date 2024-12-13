import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/dashboard/api/token/';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post('http://127.0.0.1:8000/dashboard/api/token/', {
        username,
        password,
      })
      .pipe(
        tap((response: any) => {
          if (response.access) {
            // console.log('jwt token:', response.access);
            //localStorage.setItem('testing_token', response.access); // Save access token
            localStorage.setItem('jwt_token', response.access); // Save access token
            localStorage.setItem('refresh_token', response.refresh); // Save refresh token
          } else {
            console.error('Access token not provided in the response!');
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  refreshToken(): Observable<any> {
    const refresh = localStorage.getItem('refresh_token');
    return this.http.post(
      'http://127.0.0.1:8000/dashboard/api/token/refresh/',
      {
        refresh,
      }
    );
  }

  isAuthenticated(): boolean {
    return !!this.getToken(); // Return true if token exists
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
