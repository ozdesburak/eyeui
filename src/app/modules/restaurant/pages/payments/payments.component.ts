import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Payment {
  id?: number;
  tableNumber?: number;
  amount?: number;
  method?: 'cash' | 'card' | 'online';
  status?: 'completed' | 'pending' | 'failed';
  createdAt?: Date | string;
  completedAt?: Date | string;
  // UI için ek alanlar
  tableName?: string;
  orderId?: string;
  orderItems?: any[];
  orderTotal?: number;
  orderStatus?: string;
  paymentType?: string;
  paymentStatus?: string;
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css',
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  statusFilter = 'all';
  methodFilter = 'all';
  activeTab: 'payments' | 'orders' = 'payments';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    const token = localStorage.getItem('access_token');
    this.http.get<any[]>('http://localhost:3000/payments', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data) => {
        this.payments = data.map(payment => {
          const items = payment.order?.items || [];
          const orderTotal = items.reduce((sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1), 0);
          let paymentType = '';
          switch (payment.method) {
            case 'card': paymentType = 'Kart'; break;
            case 'cash': paymentType = 'Nakit'; break;
            case 'online': paymentType = 'Online'; break;
            default: paymentType = payment.method;
          }
          return {
            ...payment,
            tableName: payment.table?.name || '',
            orderId: payment.order?._id || '',
            orderItems: items,
            orderTotal,
            orderStatus: payment.order?.status || '',
            paymentType,
            paymentStatus: 'Tamamlandı',
            createdAt: payment.createdAt,
          };
        });
        this.filteredPayments = this.payments;
      },
      error: () => {
        this.payments = [];
        this.filteredPayments = [];
      }
    });
  }

  onFilterChange(): void {
    this.filteredPayments = this.payments.filter(payment => {
      const statusMatch = this.statusFilter === 'all' || payment.status === this.statusFilter;
      const methodMatch = this.methodFilter === 'all' || payment.method === this.methodFilter;
      return statusMatch && methodMatch;
    });
  }

  getStatusText(status: string | undefined): string {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'pending':
        return 'Bekliyor';
      case 'failed':
        return 'Başarısız';
      default:
        return 'Bilinmiyor';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  }

  getMethodText(method: string | undefined): string {
    switch (method) {
      case 'cash':
        return 'Nakit';
      case 'card':
        return 'Kart';
      case 'online':
        return 'Online';
      default:
        return 'Bilinmiyor';
    }
  }

  getMethodIcon(method: string): string {
    switch (method) {
      case 'cash':
        return '💵';
      case 'card':
        return '💳';
      case 'online':
        return '🌐';
      default:
        return '❓';
    }
  }

  getTimeAgo(date: string | Date | undefined): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Az önce';
    if (minutes < 60) return `${minutes} dakika önce`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} saat önce`;
    
    const days = Math.floor(hours / 24);
    return `${days} gün önce`;
  }

  getTotalRevenue(): number {
    return this.payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  }

  getTodayRevenue(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.payments
      .filter(p => p.status === 'completed' && p.completedAt && p.completedAt >= today)
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  }

  get completedPayments() {
    return this.payments.filter(p => p.status === 'completed');
  }

  getStatusBadgeClass(status: string | undefined): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  }

  clearFilters(): void {
    this.statusFilter = 'all';
    this.methodFilter = 'all';
    this.onFilterChange();
  }
} 