import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Indicator {
  name: string;
  value: number;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule],
})
export class DashboardComponent implements OnInit {
  indicators: Indicator[] = [];
  chartData: any = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']); // Redirect to login if not authenticated
    }

    this.getIndicators();
    this.getChartData();
  }

  getIndicators(): void {
    this.http
      .get<Indicator[]>('http://127.0.0.1:8000/dashboard/api/indicators/')
      .subscribe({
        next: (data) => {
          this.indicators = data;
        },
        error: (err) => {
          console.error('Error fetching indicators:', err);
        },
      });
  }

  getChartData(): void {
    this.http
      .get('http://127.0.0.1:8000/dashboard/api/chart-data/', {
        withCredentials: true,
      })
      .subscribe({
        next: (data) => {
          this.chartData = data;
        },
        error: (err) => {
          console.error('Error fetching chart data:', err);
        },
      });
  }

  logout(): void {
    this.authService.logout(); // Calls logout method from AuthService
  }
}
