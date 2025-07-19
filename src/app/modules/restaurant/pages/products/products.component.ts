import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
  color: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  totalProducts: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  categories: Category[] = [
    { id: 1, name: 'Çorbalar', color: 'bg-orange-500' },
    { id: 2, name: 'Salatalar', color: 'bg-green-500' },
    { id: 3, name: 'Ana Yemekler', color: 'bg-red-500' },
    { id: 4, name: 'Tatlılar', color: 'bg-pink-500' },
    { id: 5, name: 'İçecekler', color: 'bg-blue-500' },
    { id: 6, name: 'Kahveler', color: 'bg-amber-500' },
    { id: 7, name: 'Atıştırmalıklar', color: 'bg-purple-500' },
  ];

  showAddModal = false;
  showEditModal = false;
  selectedProduct: Product | null = null;
  searchTerm = '';
  categoryFilter = '';
  stockFilter = 'all';
  loading = false;
  error: string | null = null;
  userRole: string | null = null;

  productForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      image: [''],
      isActive: [true]
    });
    // Kullanıcı rolünü JWT'den al
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.userRole = decoded.role || null;
      } catch (e) {
        this.userRole = null;
      }
    }
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts(page: number = 1): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const token = localStorage.getItem('access_token');
      const params: any = {
        page,
        limit: this.itemsPerPage,
      };
      if (this.categoryFilter) params.category = this.categoryFilter;
      if (this.searchTerm) params.search = this.searchTerm;
      // Stock filter mapping
      const stockMap: Record<string, string | undefined> = {
        inStock: '>0',
        outOfStock: '0',
        lowStock: 'low',
        all: undefined
      };
      const stockParam = stockMap[this.stockFilter];
      if (stockParam) params.stock = stockParam;
      console.log('Stock filter:', this.stockFilter, 'Gönderilen:', params.stock);
      const res: any = await this.http.get('http://localhost:3000/products', {
        params,
        headers: { Authorization: `Bearer ${token}` }
      }).toPromise();
      this.products = res.data;
      this.totalProducts = res.total;
      this.currentPage = page;
    } catch (err: any) {
      this.error = err?.error?.message || 'Ürünler yüklenemedi.';
    } finally {
      this.loading = false;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalProducts / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadProducts(page);
    }
  }

  openAddModal(): void {
    this.productForm.reset({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      image: '',
      isActive: true
    });
    this.showAddModal = true;
  }

  openEditModal(product: Product): void {
    this.selectedProduct = product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: product.image || '',
      isActive: product.isActive
    });
    this.showEditModal = true;
  }

  closeModal(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.selectedProduct = null;
    this.productForm.reset();
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const token = localStorage.getItem('access_token');
      try {
        this.loading = true;
        if (this.showAddModal) {
          await this.http.post('http://localhost:3000/products', formValue, {
            headers: { Authorization: `Bearer ${token}` }
          }).toPromise();
        } else if (this.showEditModal && this.selectedProduct) {
          await this.http.put(`http://localhost:3000/products/${this.selectedProduct._id}`, formValue, {
            headers: { Authorization: `Bearer ${token}` }
          }).toPromise();
        }
        this.closeModal();
        await this.loadProducts(this.currentPage);
      } catch (err: any) {
        this.error = err?.error?.message || 'Ürün kaydedilemedi.';
      } finally {
        this.loading = false;
      }
    }
  }

  async deleteProduct(product: Product): Promise<void> {
    if (confirm(`${product.name} ürününü silmek istediğinizden emin misiniz?`)) {
      const token = localStorage.getItem('access_token');
      try {
        this.loading = true;
        await this.http.delete(`http://localhost:3000/products/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).toPromise();
        await this.loadProducts(this.currentPage);
      } catch (err: any) {
        this.error = err?.error?.message || 'Ürün silinemedi.';
      } finally {
        this.loading = false;
      }
    }
  }

  toggleProductStatus(product: Product): void {
    // İsteğe bağlı: API'ye patch/put ile güncelleme yapılabilir
    this.openEditModal(product);
  }

  getCategoryColor(categoryName: string): string {
    const category = this.categories.find(c => c.name === categoryName);
    return category ? category.color : 'bg-gray-500';
  }

  getStockStatus(stock: number): { text: string; color: string } {
    if (stock === 0) {
      return { text: 'Stokta Yok', color: 'text-red-600 bg-red-100' };
    } else if (stock <= 10) {
      return { text: 'Stok Az', color: 'text-orange-600 bg-orange-100' };
    } else {
      return { text: 'Stokta', color: 'text-green-600 bg-green-100' };
    }
  }

  getTotalValue(): number {
    return this.products.reduce((total, product) => total + (product.price * product.stock), 0);
  }

  getActiveProductsCount(): number {
    return this.products.filter(p => p.isActive).length;
  }

  getLowStockProductsCount(): number {
    return this.products.filter(p => p.stock > 0 && p.stock <= 10).length;
  }

  onSearchChange(): void {
    this.loadProducts(1);
  }

  onCategoryFilterChange(): void {
    this.loadProducts(1);
  }

  onStockFilterChange(): void {
    this.loadProducts(1);
  }
} 