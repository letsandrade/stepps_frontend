import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/dashboard/api'; // Adjust as needed
  private currentUserSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(
      localStorage.getItem('user') // Assuming 'user' is stored in localStorage after login
    );
  }

  get currentUser() {
    return this.currentUserSubject.asObservable();
  }

  // Login method with session management
  login(username: string, password: string): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/login/`,
        { username, password },
        { withCredentials: true }
      )
      .pipe(
        tap((response: any) => {
          localStorage.setItem('user', JSON.stringify(response.user)); // Store user info in localStorage (optional)
          this.currentUserSubject.next(response.user);
        })
      );
  }

  // Logout method to clear session and local storage
  logout(): void {
    this.http
      .post(`${this.apiUrl}/logout/`, {}, { withCredentials: true })
      .subscribe(() => {
        localStorage.removeItem('user');
        this.currentUserSubject.next(null); // Clear currentUser
        this.router.navigate(['/login']); // Redirect to login
      });
  }

  // Check if user is authenticated based on session cookie
  isAuthenticated(): boolean {
    return !!localStorage.getItem('user'); // Return true if user is in localStorage
  }

  // Get data for dashboard, including session-based headers
  getDashboardData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`, {
      withCredentials: true,
    });
  }
}
