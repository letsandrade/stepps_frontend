import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts'; // Import BaseChartDirective
import { ChartConfiguration, ChartOptions } from 'chart.js'; // Chart.js types

interface Indicator {
  name: string;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, MatButtonModule, BaseChartDirective], // Include BaseChartDirective
})
export class DashboardComponent implements OnInit {
  indicators: Indicator[] = [];
  chartData: any = {};
  chartLabels: string[] = [];
  chartValues: number[] = [];
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

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
    const headers = this.authService.getAuthHeaders();
    this.http
      .get<Indicator[]>('http://127.0.0.1:8000/dashboard/api/indicators/', {
        headers,
      })
      .subscribe({
        next: (data: Indicator[]) => {
          this.indicators = data;
        },
        error: (err) => {
          console.error('Error fetching indicators:', err);
        },
      });
  }

  getChartData(): void {
    const headers = this.authService.getAuthHeaders();
    this.http
      .get('http://127.0.0.1:8000/dashboard/api/chart-data/', { headers })
      .subscribe({
        next: (data) => {
          this.chartData = data;
          this.populateChartData(); // Populate data for the chart
        },
        error: (err) => {
          console.error('Error fetching chart data:', err);
        },
      });
  }

  populateChartData(): void {
    const dataPoints = this.chartData.data || [];
    this.chartLabels = dataPoints.map((dp: any) => dp.label);
    this.chartValues = dataPoints.map((dp: any) => dp.value);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
