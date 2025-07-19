import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ReportData {
  period: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
  topProduct: string;
  topProductSales: number;
}

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

interface ProductPerformance {
  name: string;
  sales: number;
  revenue: number;
  percentage: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {
  selectedPeriod = 'week';
  selectedReportType = 'sales';
  
  reportData: ReportData[] = [];
  salesData: SalesData[] = [];
  productPerformance: ProductPerformance[] = [];
  
  totalRevenue = 0;
  totalOrders = 0;
  averageOrderValue = 0;
  growthRate = 0;

  ngOnInit(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    // Dummy data - gerçek uygulamada API'den gelecek
    this.reportData = [
      {
        period: 'Bu Hafta',
        revenue: 12500,
        orders: 156,
        averageOrderValue: 80.13,
        topProduct: 'Tavuk Şiş',
        topProductSales: 45
      },
      {
        period: 'Geçen Hafta',
        revenue: 11800,
        orders: 142,
        averageOrderValue: 83.10,
        topProduct: 'Coca Cola',
        topProductSales: 52
      },
      {
        period: 'Bu Ay',
        revenue: 48750,
        orders: 612,
        averageOrderValue: 79.66,
        topProduct: 'Baklava',
        topProductSales: 89
      }
    ];

    this.salesData = [
      { date: 'Pzt', revenue: 1800, orders: 22 },
      { date: 'Sal', revenue: 2100, orders: 26 },
      { date: 'Çar', revenue: 1950, orders: 24 },
      { date: 'Per', revenue: 2400, orders: 30 },
      { date: 'Cum', revenue: 2800, orders: 35 },
      { date: 'Cmt', revenue: 3200, orders: 40 },
      { date: 'Paz', revenue: 2250, orders: 28 }
    ];

    this.productPerformance = [
      { name: 'Tavuk Şiş', sales: 45, revenue: 3825, percentage: 28.8 },
      { name: 'Coca Cola', sales: 52, revenue: 780, percentage: 33.3 },
      { name: 'Baklava', sales: 38, revenue: 1520, percentage: 24.4 },
      { name: 'Mercimek Çorbası', sales: 42, revenue: 1050, percentage: 26.9 },
      { name: 'Cesar Salata', sales: 28, revenue: 980, percentage: 17.9 }
    ];

    this.calculateTotals();
  }

  calculateTotals(): void {
    this.totalRevenue = this.salesData.reduce((sum, day) => sum + day.revenue, 0);
    this.totalOrders = this.salesData.reduce((sum, day) => sum + day.orders, 0);
    this.averageOrderValue = this.totalOrders > 0 ? this.totalRevenue / this.totalOrders : 0;
    
    // Dummy growth calculation
    this.growthRate = 12.5;
  }

  onPeriodChange(): void {
    // Period değiştiğinde verileri yeniden yükle
    this.loadReportData();
  }

  onReportTypeChange(): void {
    // Rapor tipi değiştiğinde görünümü güncelle
  }

  getRevenueGrowth(): string {
    return this.growthRate >= 0 ? `+${this.growthRate}%` : `${this.growthRate}%`;
  }

  getRevenueGrowthColor(): string {
    return this.growthRate >= 0 ? 'text-green-600' : 'text-red-600';
  }

  getRevenueGrowthBg(): string {
    return this.growthRate >= 0 ? 'bg-green-100' : 'bg-red-100';
  }

  getMaxRevenue(): number {
    return Math.max(...this.salesData.map(day => day.revenue));
  }

  getBarHeight(revenue: number): string {
    const maxRevenue = this.getMaxRevenue();
    const percentage = (revenue / maxRevenue) * 100;
    return `${percentage}%`;
  }

  getTopProducts(): ProductPerformance[] {
    return this.productPerformance.slice(0, 5);
  }

  getTotalProductSales(): number {
    return this.productPerformance.reduce((sum, product) => sum + product.sales, 0);
  }

  getProductPercentage(sales: number): number {
    const total = this.getTotalProductSales();
    return total > 0 ? (sales / total) * 100 : 0;
  }

  exportReport(): void {
    // Rapor dışa aktarma işlemi
    console.log('Rapor dışa aktarılıyor...');
  }

  printReport(): void {
    window.print();
  }

  getPeriodLabel(): string {
    switch (this.selectedPeriod) {
      case 'week': return 'Bu Hafta';
      case 'month': return 'Bu Ay';
      case 'quarter': return 'Bu Çeyrek';
      case 'year': return 'Bu Yıl';
      default: return 'Bu Hafta';
    }
  }

  getReportTypeLabel(): string {
    switch (this.selectedReportType) {
      case 'sales': return 'Satış Raporu';
      case 'products': return 'Ürün Raporu';
      case 'tables': return 'Masa Raporu';
      case 'payments': return 'Ödeme Raporu';
      default: return 'Satış Raporu';
    }
  }
} 