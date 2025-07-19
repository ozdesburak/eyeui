import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCardComponent } from './components/table-card/table-card.component';
import { TableDetailComponent } from './components/table-detail/table-detail.component';
import { TableFiltersComponent, TableFilters } from './components/table-filters/table-filters.component';
import { Table } from './models/table.model';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';
import { TableService } from './services/table.service';
import { OrderService } from './services/order.service';
import { FormsModule } from '@angular/forms';
import { SocketService } from 'src/app/core/services/socket.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule, TableCardComponent, TableDetailComponent, TableFiltersComponent, ThemeToggleComponent, FormsModule],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css',
})
export class TablesComponent implements OnInit {
  tables: any[] = [];
  filteredTables: any[] = [];
  selectedTable: any = null;
  showDetail = false;
  currentFilters: TableFilters = {
    status: '',
    minCapacity: null,
    maxCapacity: null,
    minAmount: null,
    maxAmount: null,
    hasOrder: null
  };
  loading = false;
  error: string | null = null;
  addTableModalOpen = false;
  addTableForm = {
    name: '',
    group: '',
    capacity: 4,
    status: 'available'
  };
  private reloadTables$ = new Subject<void>();

  constructor(
    private tableService: TableService,
    private orderService: OrderService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.loadTables();
    this.reloadTables$.pipe(debounceTime(200)).subscribe(() => this.loadTables());
    this.socketService.onOrderCreated().subscribe(() => this.reloadTables$.next());
    this.socketService.onOrderUpdated().subscribe(() => this.reloadTables$.next());
  }

  loadTables(): void {
    this.loading = true;
    this.error = null;
    this.tableService.getTables().subscribe({
      next: (tables) => {
        // Backend'den gelen activeOrder'ı currentOrder olarak da ata
        this.tables = tables.map((table: any) => ({
          ...table,
          currentOrder: table.activeOrder || null
        }));
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Masalar yüklenemedi.';
        this.loading = false;
      }
    });
  }

  onTableClick(table: any): void {
    // Her açılışta yeni bir referans ile table gönder, currentOrder'ı null yap
    this.selectedTable = { ...table, currentOrder: null };
    this.showDetail = true;
    // TableDetailComponent ngOnInit'inde loadActiveOrder ve loadOrderHistory çağrılıyor, burada ekstra bir şey yapmaya gerek yok
  }

  onCloseDetail(): void {
    this.showDetail = false;
    this.selectedTable = null;
    this.reloadTables$.next();
  }

  onTableStatusChange(table: any, status: string): void {
    this.tableService.updateTable(table._id, { status }).subscribe({
      next: (updated) => {
        table.status = updated.status;
        if (status === 'available') {
          table.currentOrder = null;
          table.totalAmount = 0;
        }
      },
      error: () => {
        this.error = 'Masa durumu güncellenemedi.';
      }
    });
  }

  onFiltersChange(filters: TableFilters): void {
    this.currentFilters = filters;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredTables = this.tables.filter(table => {
      if (this.currentFilters.status && table.status !== this.currentFilters.status) {
        return false;
      }
      if (this.currentFilters.minCapacity && table.capacity < this.currentFilters.minCapacity) {
        return false;
      }
      if (this.currentFilters.maxCapacity && table.capacity > this.currentFilters.maxCapacity) {
        return false;
      }
      if (this.currentFilters.minAmount && table.totalAmount < this.currentFilters.minAmount) {
        return false;
      }
      if (this.currentFilters.maxAmount && table.totalAmount > this.currentFilters.maxAmount) {
        return false;
      }
      if (this.currentFilters.hasOrder !== null) {
        const hasOrder = table.currentOrder !== null && table.currentOrder.items.length > 0;
        if (this.currentFilters.hasOrder !== hasOrder) {
          return false;
        }
      }
      return true;
    });
  }

  onTableUpdate(updatedTable: any): void {
    const index = this.tables.findIndex(t => t._id === updatedTable._id);
    if (index !== -1) {
      this.tables[index] = { ...updatedTable, status: updatedTable.status.toLowerCase() as any };
      this.applyFilters();
    }
  }

  get availableTables() {
    return this.filteredTables.filter(t => t.status === 'available');
  }
  get occupiedTables() {
    return this.filteredTables.filter(t => t.status === 'occupied');
  }
  get reservedTables() {
    return this.filteredTables.filter(t => t.status === 'reserved');
  }

  trackByTableId(index: number, table: any | null): string {
    return table ? table._id : index.toString();
  }

  openAddTableModal(): void {
    this.addTableModalOpen = true;
    this.addTableForm = {
      name: '',
      group: '',
      capacity: 4,
      status: 'available'
    };
  }

  closeAddTableModal(): void {
    this.addTableModalOpen = false;
  }

  submitAddTable(): void {
    if (!this.addTableForm.name || !this.addTableForm.group) {
      this.error = 'Masa adı ve grup zorunlu.';
      return;
    }
    this.tableService.createTable(this.addTableForm).subscribe({
      next: (table) => {
        this.tables.push(table);
        this.applyFilters();
        this.closeAddTableModal();
      },
      error: () => {
        this.error = 'Masa eklenemedi.';
      }
    });
  }
} 