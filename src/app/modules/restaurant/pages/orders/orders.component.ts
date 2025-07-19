import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../tables/models/table.model';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../tables/services/order.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  statusFilter = 'all';
  selectedOrder: any = null;
  page = 1;
  pageSize = 10;
  totalPages = 1;
  totalOrders = 0;
  pagedOrders: any[] = [];

  constructor(
    private orderService: OrderService, 
    private socketService: SocketService,
    public themeService: ThemeService
  ) {}

  get isDarkMode(): boolean {
    return this.themeService.isDark;
  }

  ngOnInit(): void {
    this.loadOrders();
    this.socketService.onOrderCreated().subscribe(() => this.loadOrders());
    this.socketService.onOrderUpdated().subscribe(() => this.loadOrders());
  }

  updatePagedOrders(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.pageSize) || 1;
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedOrders = this.filteredOrders.slice(start, end);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.page = page;
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders(this.page, this.pageSize, this.statusFilter).subscribe({
      next: (res) => {
        // Cancelled siparişleri filtrele
        this.orders = res.data.filter((o: any) => o.status !== 'cancelled');
        this.filteredOrders = this.orders;
        this.totalOrders = this.orders.length;
        this.totalPages = Math.ceil(this.orders.length / this.pageSize) || 1;
        this.pagedOrders = this.orders;
      },
      error: () => {
        this.orders = [];
        this.filteredOrders = [];
        this.totalOrders = 0;
        this.totalPages = 1;
        this.pagedOrders = [];
      }
    });
  }

  onStatusFilterChange(): void {
    this.page = 1;
    this.loadOrders();
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'Bekliyor';
      case 'preparing':
        return 'Hazırlanıyor';
      case 'ready':
        return 'Hazır';
      case 'served':
        return 'Servis Edildi';
      case 'paid':
        return 'Ödendi';
      default:
        return 'Bilinmiyor';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'preparing':
        return 'bg-blue-500';
      case 'ready':
        return 'bg-green-500';
      case 'served':
        return 'bg-purple-500';
      case 'paid':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  }

  getTimeAgo(date: any): string {
    const d = (date instanceof Date) ? date : new Date(date);
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

  get pendingOrders() {
    return this.orders.filter(o => o.status === 'pending');
  }
  get preparingOrders() {
    return this.orders.filter(o => o.status === 'preparing');
  }
  get readyOrders() {
    return this.orders.filter(o => o.status === 'ready');
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'served':
        return 'bg-purple-100 text-purple-800';
      case 'paid':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTopItems(items: any[]): string {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0].name;
    if (items.length === 2) return `${items[0].name}, ${items[1].name}`;
    return `${items[0].name}, ${items[1].name} +${items.length - 2}`;
  }

  clearFilters(): void {
    this.statusFilter = 'all';
    this.onStatusFilterChange();
  }

  getTableNumber(order: Order): number {
    // Dummy table number based on order ID
    return order.id;
  }

  getItemsSummary(items: any[]): string {
    if (items.length === 0) return '';
    if (items.length === 1) return `${items[0].quantity}x ${items[0].name}`;
    if (items.length === 2) return `${items[0].quantity}x ${items[0].name}, ${items[1].quantity}x ${items[1].name}`;
    return `${items[0].quantity}x ${items[0].name}, ${items[1].quantity}x ${items[1].name} +${items.length - 2}`;
  }

  openOrderDetail(order: any) {
    this.selectedOrder = order;
  }

  closeOrderDetail() {
    this.selectedOrder = null;
  }

  changeOrderStatus(order: any, newStatus: string) {
    this.orderService.updateOrder(order._id || order.id, { status: newStatus }).subscribe({
      next: (updatedOrder) => {
        // orders ve filteredOrders içindeki ilgili siparişi güncelle
        const idx = this.orders.findIndex(o => (o._id || o.id) === (order._id || order.id));
        if (idx > -1) {
          this.orders[idx] = { ...this.orders[idx], ...updatedOrder };
        }
        const fidx = this.filteredOrders.findIndex(o => (o._id || o.id) === (order._id || order.id));
        if (fidx > -1) {
          this.filteredOrders[fidx] = { ...this.filteredOrders[fidx], ...updatedOrder };
        }
      }
    });
  }

  getProcessStatusText(status: string): string {
    switch (status) {
      case 'created': return 'Sipariş Oluşturuldu';
      case 'preparing': return 'Hazırlanıyor';
      case 'served': return 'Servis Edildi';
      default: return 'Bilinmiyor';
    }
  }

  getItemStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Hazırlanacak';
      case 'preparing': return 'Hazırlanıyor';
      case 'served': return 'Servis Edildi';
      case 'cancelled': return 'İptal';
      default: return 'Bilinmiyor';
    }
  }

  changeProcessStatus(order: any, newStatus: string) {
    this.orderService.updateOrder(order._id || order.id, { processStatus: newStatus }).subscribe({
      next: (updatedOrder) => {
        const idx = this.orders.findIndex(o => (o._id || o.id) === (order._id || order.id));
        if (idx > -1) {
          this.orders[idx] = { ...this.orders[idx], ...updatedOrder };
        }
        const fidx = this.filteredOrders.findIndex(o => (o._id || o.id) === (order._id || order.id));
        if (fidx > -1) {
          this.filteredOrders[fidx] = { ...this.filteredOrders[fidx], ...updatedOrder };
        }
      }
    });
  }

  getPendingItems(order: any) {
    return (order.items || []).filter((item: any) => item.status === 'pending');
  }
  getOtherItems(order: any) {
    return (order.items || []).filter((item: any) => item.status !== 'pending');
  }

  hasPendingItems(order: any) {
    return (order.items || []).some((item: any) => item.status === 'pending');
  }

  onItemStatusToggle(order: any, item: any, event: any) {
    const checked = event.target.checked;
    item.status = checked ? 'served' : 'preparing';
    this.orderService.updateOrder(order._id || order.id, {
      items: order.items
    }).subscribe();
  }

  // Siparişleri düzleştirip her pending grup ve diğer ürünler için ayrı satır oluştur
  get flattenedOrders() {
    const result: any[] = [];
    for (const order of this.pagedOrders) {
      const pendingItems = (order.items || []).filter((item: any) => item.status === 'pending');
      const otherItems = (order.items || []).filter((item: any) => item.status !== 'pending');
      if (pendingItems.length > 0) {
        result.push({
          ...order,
          items: pendingItems,
          isPendingGroup: true,
        });
      }
      if (otherItems.length > 0) {
        result.push({
          ...order,
          items: otherItems,
          isPendingGroup: false,
        });
      }
    }
    return result;
  }
} 