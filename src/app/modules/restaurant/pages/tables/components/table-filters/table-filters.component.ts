import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableFilters {
  status: string;
  minCapacity: number | null;
  maxCapacity: number | null;
  minAmount: number | null;
  maxAmount: number | null;
  hasOrder: boolean | null;
}

@Component({
  selector: 'app-table-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table-filters.component.html',
  styleUrl: './table-filters.component.css',
})
export class TableFiltersComponent {
  @Output() filtersChange = new EventEmitter<TableFilters>();

  filters: TableFilters = {
    status: '',
    minCapacity: null,
    maxCapacity: null,
    minAmount: null,
    maxAmount: null,
    hasOrder: null
  };

  statusOptions = [
    { value: '', label: 'Tüm Durumlar' },
    { value: 'available', label: 'Müsait' },
    { value: 'occupied', label: 'Dolu' },
    { value: 'reserved', label: 'Rezerve' },
    { value: 'cleaning', label: 'Temizlik' }
  ];

  orderOptions = [
    { value: null, label: 'Tümü' },
    { value: true, label: 'Siparişi Olan' },
    { value: false, label: 'Siparişi Olmayan' }
  ];

  onFilterChange(): void {
    this.filtersChange.emit({ ...this.filters });
  }

  clearFilters(): void {
    this.filters = {
      status: '',
      minCapacity: null,
      maxCapacity: null,
      minAmount: null,
      maxAmount: null,
      hasOrder: null
    };
    this.onFilterChange();
  }
} 