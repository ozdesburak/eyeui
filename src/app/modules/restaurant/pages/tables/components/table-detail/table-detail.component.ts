import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, OrderItem } from '../../models/table.model';
import { OrderService } from '../../services/order.service';
import { HttpClient } from '@angular/common/http';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

@Component({
  selector: 'app-table-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ],
  templateUrl: './table-detail.component.html',
  styleUrl: './table-detail.component.css',
})
export class TableDetailComponent implements OnInit {
  @Input() table!: any;
  @Output() close = new EventEmitter<void>();
  @Output() tableUpdate = new EventEmitter<any>();

  constructor(private cdr: ChangeDetectorRef, private orderService: OrderService, private http: HttpClient) {}

  newItem: OrderItem = {
    id: 0,
    name: '',
    quantity: 1,
    price: 0,
    notes: ''
  };

  // Search and filter properties
  searchTerm: string = '';
  selectedCategory: string = 'Tümü';
  selectedProductId: string = '';
  selectedProductQty: number = 1;

  products: Product[] = [];
  pendingItems: OrderItem[] = [];
  errorMessage: string = '';

  get categories(): string[] {
    const cats = ['Tümü', ...new Set(this.products.map((item: Product) => item.category))];
    return cats;
  }

  get filteredProducts(): Product[] {
    let filtered: Product[] = this.products;
    if (this.selectedCategory !== 'Tümü') {
      filtered = filtered.filter((item: Product) => item.category === this.selectedCategory);
    }
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter((item: Product) =>
        item.name.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search)
      );
    }
    return filtered;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.cdr.detectChanges();
  }

  // Enhanced menu items with categories
  // menuItems array ve filterMenuItems fonksiyonunu kaldırınca, bu kısım da kullanılmıyor.

  // Get unique categories
  // get categories(): string[] {
  //   const cats = ['Tümü', ...new Set(this.menuItems.map(item => item.category))];
  //   return cats;
  // }

  paymentMethod: string = 'cash';
  orderHistory: any[] = [];
  loadingHistory = false;

  ngOnInit(): void {
    this.loadProducts();
    this.loadActiveOrder();
    this.loadOrderHistory();
  }

  loadProducts(): void {
    const token = localStorage.getItem('access_token');
    this.http.get<Product[]>('http://localhost:3000/products', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        console.log('API response:', res);
        this.products = res.data || res.products || res;
        this.cdr.detectChanges();
      },
      error: () => {
        this.products = [];
      }
    });
  }

  loadActiveOrder(): void {
    if (this.table?._id) {
      this.orderService.getActiveOrder(this.table._id).subscribe({
        next: (order) => {
          this.table.currentOrder = order;
          this.cdr.detectChanges();
        },
        error: () => {
          this.table.currentOrder = null;
        }
      });
    }
  }

  loadOrderHistory(): void {
    if (this.table?._id) {
      this.loadingHistory = true;
      this.orderService.getOrderHistory(this.table._id).subscribe({
        next: (orders) => {
          this.orderHistory = orders.filter((o: any) => o.status !== 'active');
          this.loadingHistory = false;
        },
        error: () => {
          this.loadingHistory = false;
        }
      });
    }
  }

  // Filter menu items based on search term and category
  // filterMenuItems(): void {
  //   let filtered = this.menuItems;

  //   // Filter by category
  //   if (this.selectedCategory !== 'Tümü') {
  //     filtered = filtered.filter(item => item.category === this.selectedCategory);
  //   }

  //   // Filter by search term
  //   if (this.searchTerm.trim()) {
  //     const search = this.searchTerm.toLowerCase().trim();
  //     filtered = filtered.filter(item => 
  //       item.name.toLowerCase().includes(search) ||
  //       item.category.toLowerCase().includes(search)
  //     );
  //   }

  //   this.filteredMenuItems = filtered;
  // }

  // Select category and filter
  // selectCategory(category: string): void {
  //   this.selectedCategory = category;
  //   this.filterMenuItems();
  // }

  get orderTotal(): number {
    if (!this.table?.currentOrder || !this.table.currentOrder.items?.length) {
      return 0;
    }
    return this.table.currentOrder.items.reduce((total: number, item: any) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  addProductToOrder(): void {
    if (!this.selectedProductId || this.selectedProductQty < 1) return;
    const product = this.products.find(p => p._id === this.selectedProductId);
    if (!product) return;
    const item = {
      id: Date.now(),
      name: product.name,
      quantity: this.selectedProductQty,
      price: product.price,
      notes: '',
      product: product._id // MongoDB ürün ID'si eklendi
    };
    // Eğer aktif sipariş yoksa veya _id yoksa, createOrder çağır
    if (!this.table.currentOrder || !this.table.currentOrder._id) {
      this.orderService.createOrder({
        table: this.table._id,
        restaurant: this.table.restaurant,
        status: 'active',
        items: [item],
        totalAmount: product.price * this.selectedProductQty
      }).subscribe({
        next: (order) => {
          const orderId = order?._id || order?.id || order?.data?._id || order?.order?._id;
          this.table.currentOrder = order;
          this.table.currentOrder._id = orderId;
          this.table.currentOrder.items = [item];
          this.selectedProductId = '';
          this.selectedProductQty = 1;
          this.errorMessage = '';
          this.cdr.detectChanges();
          this.tableUpdate.emit(this.table);
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Sipariş eklenemedi.';
        }
      });
      return;
    }
    // Aktif sipariş varsa updateOrder çağır
    if (!this.table.currentOrder.items) {
      this.table.currentOrder.items = [];
    }
    (item as any).product = product._id;
    // Yeni ürün eklendiğinde servis durumunu beklemede yap
    this.table.currentOrder.processStatus = 'pending';
    this.table.currentOrder.items.push(item);
    this.table.currentOrder.total = (this.table.currentOrder.total || 0) + (product.price * this.selectedProductQty);
    this.orderService.updateOrder(this.table.currentOrder._id, {
      items: this.table.currentOrder.items,
      total: this.table.currentOrder.total,
      processStatus: this.table.currentOrder.processStatus,
      paymentMethod: this.paymentMethod
    }).subscribe({
      next: (updatedOrder) => {
        this.table.currentOrder = updatedOrder;
        this.selectedProductId = '';
        this.selectedProductQty = 1;
        this.errorMessage = '';
        this.cdr.detectChanges();
        this.tableUpdate.emit(this.table);
      },
      error: (err) => {
        // Hata olursa eklenen ürünü geri çıkar
        this.table.currentOrder.items = this.table.currentOrder.items.filter((i: any) => i.id !== item.id);
        this.table.currentOrder.total = (this.table.currentOrder.total || 0) - (product.price * this.selectedProductQty);
        this.errorMessage = err?.error?.message || 'Sipariş güncellenemedi.';
        this.cdr.detectChanges();
      }
    });
  }

  addProductToOrderDirect(product: Product): void {
    this.selectedProductId = product._id;
    this.selectedProductQty = 1;
    this.addProductToOrder();
  }

  onClose(): void {
    this.close.emit();
  }

  onAddItem(): void {
    if (this.newItem.name && this.newItem.price > 0) {
      if (!this.table.currentOrder) {
        // Sipariş yoksa backend'de yeni sipariş başlat
        this.orderService.createOrder({
          table: this.table._id,
          restaurant: this.table.restaurant,
          status: 'active',
          items: [],
          totalAmount: 0
        }).subscribe({
          next: (order) => {
            this.table.currentOrder = order;
            this.addItemToOrder();
          }
        });
      } else {
        this.addItemToOrder();
      }
    }
  }

  private addItemToOrder(): void {
    if (!this.table.currentOrder || !this.table.currentOrder._id) {
      console.error('Sipariş güncellenemiyor: currentOrder veya _id yok!');
      return;
    }
    const item = {
      ...this.newItem,
      id: Date.now()
    };
    this.table.currentOrder.items.push(item);
    this.table.status = 'occupied';
    this.table.totalAmount = this.orderTotal;
    this.orderService.updateOrder(this.table.currentOrder._id, {
      items: this.table.currentOrder.items,
      total: this.orderTotal
    }).subscribe({
      next: (updatedOrder) => {
        this.table.currentOrder = updatedOrder;
        this.tableUpdate.emit(this.table);
        this.cdr.detectChanges();
        this.newItem = {
          id: 0,
          name: '',
          quantity: 1,
          price: 0,
          notes: ''
        };
      }
    });
  }

  onRemoveItem(itemId: number): void {
    if (!this.table.currentOrder || !this.table.currentOrder._id) {
      console.error('Sipariş güncellenemiyor: currentOrder veya _id yok!');
      return;
    }
    this.table.currentOrder.items = this.table.currentOrder.items.filter((i: any) => i.id !== itemId);
    this.table.totalAmount = this.orderTotal;
    this.orderService.updateOrder(this.table.currentOrder._id, {
      items: this.table.currentOrder.items,
      total: this.orderTotal
    }).subscribe({
      next: (updatedOrder) => {
        this.table.currentOrder = updatedOrder;
        this.tableUpdate.emit(this.table);
        this.cdr.detectChanges();
      }
    });
  }

  onQuickAdd(item: any): void {
    if (!this.table.currentOrder) {
      this.table.currentOrder = {
        id: Date.now(),
        items: [],
        total: 0,
        status: 'pending',
        createdAt: new Date()
      };
    }

    const orderItem: OrderItem = {
      id: Date.now(),
      name: item.name,
      quantity: this.newItem.quantity,
      price: item.price,
      notes: ''
    };

    this.table.currentOrder.items.push(orderItem);
    this.table.status = 'occupied'; // Ürün eklenince masa dolu olsun
    this.table = {
      ...this.table,
      totalAmount: this.orderTotal
    };

    this.tableUpdate.emit(this.table);
    this.cdr.detectChanges();
  }

  increaseQuantity(): void {
    this.newItem.quantity++;
  }

  decreaseQuantity(): void {
    if (this.newItem.quantity > 1) {
      this.newItem.quantity--;
    }
  }

  increaseItemQuantity(item: any): void {
    if (!this.table.currentOrder || !this.table.currentOrder._id) {
      console.error('Sipariş güncellenemiyor: currentOrder veya _id yok!');
      return;
    }
    item.quantity++;
    this.table.totalAmount = this.orderTotal;
    this.orderService.updateOrder(this.table.currentOrder._id, {
      items: this.table.currentOrder.items,
      totalAmount: this.orderTotal
    }).subscribe({
      next: () => {},
      error: (err) => {
        item.quantity--;
        this.errorMessage = err?.error?.message || 'Sipariş güncellenemedi.';
        this.cdr.detectChanges();
      }
    });
  }

  decreaseItemQuantity(item: any): void {
    if (!this.table.currentOrder || !this.table.currentOrder._id) {
      console.error('Sipariş güncellenemiyor: currentOrder veya _id yok!');
      return;
    }
    if (item.quantity > 1) {
      item.quantity--;
      this.table.totalAmount = this.orderTotal;
      this.orderService.updateOrder(this.table.currentOrder._id, {
        items: this.table.currentOrder.items,
        totalAmount: this.orderTotal
      }).subscribe({
        next: () => {},
        error: (err) => {
          item.quantity++;
          this.errorMessage = err?.error?.message || 'Sipariş güncellenemedi.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  private updateTableTotal(): void {
    this.table = {
      ...this.table,
      totalAmount: this.orderTotal
    };
    this.tableUpdate.emit(this.table);
    this.cdr.detectChanges();
  }

  onCompleteOrder(): void {
    if (!this.table.currentOrder || !this.table.currentOrder._id) {
      console.error('Sipariş güncellenemiyor: currentOrder veya _id yok!');
      return;
    }
    this.orderService.updateOrder(this.table.currentOrder._id, {
      status: 'completed',
      items: this.table.currentOrder.items,
      totalAmount: this.orderTotal,
      paymentMethod: this.paymentMethod
    }).subscribe({
      next: (updatedOrder) => {
        // Sipariş tamamlanınca ödeme kaydı oluştur
        const token = localStorage.getItem('access_token');
        this.http.post('http://localhost:3000/payments', {
          order: updatedOrder._id,
          table: updatedOrder.table,
          amount: updatedOrder.totalAmount || this.orderTotal,
          method: this.paymentMethod,
          status: 'completed'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        }).subscribe({
          next: () => {
            // Sipariş ve ödeme başarıyla tamamlandı
            this.table.currentOrder = null;
            this.table.status = 'available';
            this.table.totalAmount = 0;
            this.tableUpdate.emit(this.table);
            this.cdr.detectChanges();
            this.loadOrderHistory();
            this.close.emit(); // Modalı kapat
          },
          error: (err) => {
            this.errorMessage = err?.error?.message || 'Ödeme kaydı oluşturulamadı.';
          }
        });
      }
    });
  }

  onCancelOrder(): void {
    if (!this.table.currentOrder || !this.table.currentOrder._id) {
      console.error('Sipariş güncellenemiyor: currentOrder veya _id yok!');
      return;
    }
    this.orderService.updateOrder(this.table.currentOrder._id, {
      status: 'cancelled',
      items: this.table.currentOrder.items,
      totalAmount: this.orderTotal
    }).subscribe({
      next: (updatedOrder) => {
        this.table.currentOrder = null;
        this.table.status = 'available';
        this.table.totalAmount = 0;
        this.tableUpdate.emit(this.table);
        this.cdr.detectChanges();
        this.loadOrderHistory();
      }
    });
  }

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
      case 'cancelled':
        return 'İptal';
      default:
        return '';
    }
  }

  changeOrderStatus(newStatus: string): void {
    if (!this.table.currentOrder || !this.table.currentOrder._id) return;
    this.orderService.updateOrder(this.table.currentOrder._id, { status: newStatus }).subscribe({
      next: (updatedOrder) => {
        this.table.currentOrder = updatedOrder;
        this.cdr.detectChanges();
        this.tableUpdate.emit(this.table);
      }
    });
  }

  // Format price with TL symbol
  formatPrice(price: number): string {
    return `${price.toFixed(2)} ₺`;
  }

  // Get icon for menu item category - Single icon for all categories
  getCategoryIcon(category: string): string {
    // Single meaningful icon for all menu items - Utensils icon
    return 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zM3 7h18M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7';
  }

  // Get background color for category - Single color for all categories
  getCategoryColor(category: string): string {
    // Single color for all menu items - Slate color
    return 'bg-slate-600 dark:bg-slate-500';
  }

  onProductSelect(product: Product): void {
    this.selectedProductId = product._id;
    this.selectedProductQty = 1;
  }

  get selectedProductName(): string {
    const product = this.products.find(p => p._id === this.selectedProductId);
    return product ? product.name : '';
  }
} 