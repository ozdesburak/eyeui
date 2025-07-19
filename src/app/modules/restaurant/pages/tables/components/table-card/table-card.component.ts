import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from '../../models/table.model';

@Component({
  selector: 'app-table-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-card.component.html',
  styleUrl: './table-card.component.css',
})
export class TableCardComponent {
  @Input() table!: Table;
  @Output() tableClick = new EventEmitter<Table>();
  @Output() statusChange = new EventEmitter<{table: Table, status: string}>();
  // tableMove kaldırıldı

  getStatusColor(): string {
    switch (this.table.status) {
      case 'available':
        return 'bg-green-500';
      case 'occupied':
        return 'bg-orange-500';
      case 'reserved':
        return 'bg-blue-500';
      case 'cleaning':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  }

  onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.statusChange.emit({table: this.table, status: select.value as 'available' | 'occupied' | 'reserved' | 'cleaning'});
  }

  onCardClick(): void {
    this.tableClick.emit(this.table);
  }

  getFormattedAmount(): string {
    // Aktif sipariş varsa ürünlerin toplam fiyatını hesapla
    const order = this.table.currentOrder || this.table.activeOrder;
    if (order && order.items && order.items.length > 0) {
      const total = order.items.reduce((sum: number, item: any) => {
        const price = item.product?.price ?? item.price ?? 0;
        return sum + price * item.quantity;
      }, 0);
      return `₺ ${total.toFixed(2)}`;
    }
    return `₺ ${(this.table.totalAmount || 0).toFixed(2)}`;
  }

  getOrderProductCount(): number {
    const order = this.table.currentOrder || this.table.activeOrder;
    return order && order.items ? order.items.length : 0;
  }

  getProcessStatusText(status: string): string {
    switch (status) {
      case 'created': return 'Sipariş Oluşturuldu';
      case 'preparing': return 'Hazırlanıyor';
      case 'served': return 'Servis Edildi';
      default: return 'Bilinmiyor';
    }
  }


} 