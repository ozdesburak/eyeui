import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Table } from '../tables/models/table.model';
import { interval, Subscription } from 'rxjs';

interface DashboardStats {
  totalTables: number;
  occupiedTables: number;
  availableTables: number;
  reservedTables: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  activeProducts: number;
  lowStockProducts: number;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'payment' | 'table' | 'product';
  message: string;
  time: string | Date;
  status: 'success' | 'warning' | 'info' | 'error';
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats = {
    totalTables: 0,
    occupiedTables: 0,
    availableTables: 0,
    reservedTables: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    activeProducts: 0,
    lowStockProducts: 0
  };

  recentActivities: RecentActivity[] = [];
  topProducts: TopProduct[] = [];
  tableStatusData: any[] = [];
  currentDate = new Date();
  loading = true;
  error = false;
  private refreshSubscription?: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.updateCurrentDate();
    
    // Her dakika tarihi güncelle
    setInterval(() => {
      this.updateCurrentDate();
    }, 60000);

    // Her 30 saniyede bir dashboard verilerini güncelle
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.loadDashboardData();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }



  updateCurrentDate(): void {
    this.currentDate = new Date();
  }

  loadDashboardData(): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Token not found');
      this.error = true;
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Dashboard istatistiklerini yükle
    this.http.get<any>(`http://localhost:3000/dashboard/stats`, { headers })
      .subscribe({
        next: (response) => {
          console.log('Dashboard stats response:', response);
          this.stats = {
            totalTables: response.totalTables || 0,
            occupiedTables: response.occupiedTables || 0,
            availableTables: response.availableTables || 0,
            reservedTables: response.reservedTables || 0,
            totalOrders: response.totalOrders || 0,
            pendingOrders: response.pendingOrders || 0,
            completedOrders: response.completedOrders || 0,
            totalRevenue: response.totalRevenue || 0,
            todayRevenue: response.todayRevenue || 0,
            activeProducts: response.activeProducts || 0,
            lowStockProducts: response.lowStockProducts || 0
          };

          this.updateTableStatusData();
          this.loading = false;
        },
        error: (error) => {
          console.error('Dashboard stats error:', error);
          this.error = true;
          this.loading = false;
        }
      });

    // En çok satan ürünleri yükle
    this.http.get<any>(`http://localhost:3000/dashboard/top-products`, { headers })
      .subscribe({
        next: (response) => {
          this.topProducts = response.products || [];
        },
        error: (error) => {
          console.error('Top products error:', error);
          this.topProducts = [];
        }
      });

    // Son aktiviteleri yükle
    this.http.get<any>(`http://localhost:3000/dashboard/recent-activities`, { headers })
      .subscribe({
        next: (response) => {
          console.log('Recent activities response:', response);
          this.recentActivities = response.activities || [];
          console.log('Recent activities set:', this.recentActivities);
        },
        error: (error) => {
          console.error('Recent activities error:', error);
          this.recentActivities = [];
        }
      });
  }

  updateTableStatusData(): void {
    this.tableStatusData = [
      { status: 'Dolu', count: this.stats.occupiedTables, color: 'bg-orange-500' },
      { status: 'Müsait', count: this.stats.availableTables, color: 'bg-green-500' },
      { status: 'Rezerve', count: this.stats.reservedTables, color: 'bg-blue-500' }
    ];
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'order':
        return 'M12 6v6m0 0v6m0-6h6m-6 0H6';
      case 'payment':
        return 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1';
      case 'table':
        return 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z';
      case 'product':
        return 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getActivityColor(status: string): string {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'warning':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
      case 'info':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'error':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  }

  getTimeAgo(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Az önce';
    if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} gün önce`;
  }

  getOccupancyRate(): number {
    return this.stats.totalTables > 0 ? Math.round((this.stats.occupiedTables / this.stats.totalTables) * 100) : 0;
  }

  getOrderCompletionRate(): number {
    return this.stats.totalOrders > 0 ? Math.round((this.stats.completedOrders / this.stats.totalOrders) * 100) : 0;
  }

  getRevenueGrowth(): number {
    // API'den gelecek gerçek büyüme verisi
    // Şimdilik dummy data
    return 12.5;
  }

  getOrderGrowth(): number {
    // API'den gelecek gerçek büyüme verisi
    // Şimdilik dummy data
    return 8.3;
  }

  retryLoad(): void {
    this.error = false;
    this.loading = true;
    this.loadDashboardData();
  }
} 