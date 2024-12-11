import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private currentUserSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      localStorage.getItem('user')
    );
  }

  get currentUser() {
    return this.currentUserSubject.asObservable();
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(`${this.apiUrl}/login/`, { username, password })
      .subscribe((data) => {
        localStorage.setItem('user', JSON.stringify(data));
        this.currentUserSubject.next(data);
      });
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token'); // Adjust this based on your token storage
  }

  isAuthenticated(): boolean {
    return !!this.getToken(); // Return true if token exists
  }
}
