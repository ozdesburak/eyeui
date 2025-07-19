import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface MenuCategory {
  id: number;
  name: string;
  icon: string;
  description?: string;
  items: MenuItem[];
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  allergens?: string[];
  preparationTime?: number; // dakika
  calories?: number;
  ingredients?: string[];
  available: boolean;
}

interface CartItem {
  item: MenuItem;
  quantity: number;
  specialRequests?: string;
}

@Component({
  selector: 'app-customer-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './customer-menu.component.html',
  styleUrls: ['./customer-menu.component.css']
})
export class CustomerMenuComponent implements OnInit {
  categories: MenuCategory[] = [];
  selectedCategory: MenuCategory | null = null;
  searchTerm: string = '';
  cart: CartItem[] = [];
  showCart: boolean = false;
  showItemModal: boolean = false;
  selectedItem: MenuItem | null = null;
  selectedQuantity: number = 1;
  specialRequests: string = '';
  
  // Filters
  showFilters: boolean = false;
  showOnlyAvailable: boolean = true;
  showOnlyVegetarian: boolean = false;
  showOnlyGlutenFree: boolean = false;
  maxPrice: number = 1000;
  sortBy: 'name' | 'price' | 'popularity' = 'name';
  
  // View Mode
  viewMode: 'grid-2' | 'grid-4' | 'list' = 'grid-2';
  
  // Footer Menu
  showSearch: boolean = false;
  showViewMode: boolean = false;

  constructor() {}

  ngOnInit() {
    this.loadMenuData();
    this.selectedCategory = this.categories[0];
  }

  loadMenuData() {
    this.categories = [
      {
        id: 1,
        name: 'Başlangıçlar',
        icon: '🍽️',
        description: 'Lezzetli başlangıçlar ve mezeler',
        items: [
          {
            id: 1,
            name: 'Humus',
            description: 'Nohut püresi, tahin, zeytinyağı ve baharatlarla',
            price: 45,
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=800&fit=crop',
            category: 'Başlangıçlar',
            isVegetarian: true,
            isGlutenFree: true,
            calories: 180,
            ingredients: ['Nohut', 'Tahin', 'Zeytinyağı', 'Limon', 'Sarımsak'],
            allergens: ['Susam'],
            preparationTime: 5,
            available: true
          },
          {
            id: 2,
            name: 'Çiğ Köfte',
            description: 'Geleneksel baharatlarla hazırlanmış çiğ köfte',
            price: 55,
            image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=600&h=800&fit=crop',
            category: 'Başlangıçlar',
            isSpicy: true,
            isVegetarian: true,
            calories: 220,
            ingredients: ['Bulgur', 'Domates salçası', 'Baharatlar', 'Soğan'],
            allergens: ['Gluten'],
            preparationTime: 8,
            available: true
          },
          {
            id: 3,
            name: 'Mercimek Çorbası',
            description: 'Geleneksel kırmızı mercimek çorbası',
            price: 35,
            image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=600&h=800&fit=crop',
            category: 'Başlangıçlar',
            isVegetarian: true,
            isGlutenFree: true,
            calories: 150,
            ingredients: ['Kırmızı mercimek', 'Soğan', 'Havuç', 'Baharatlar'],
            allergens: [],
            preparationTime: 10,
            available: true
          },
          {
            id: 13,
            name: 'Haydari',
            description: 'Yoğurt, nane ve sarımsaklı meze',
            price: 40,
            image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=600&h=800&fit=crop',
            category: 'Başlangıçlar',
            isVegetarian: true,
            isGlutenFree: true,
            calories: 120,
            ingredients: ['Yoğurt', 'Nane', 'Sarımsak'],
            allergens: ['Süt'],
            preparationTime: 4,
            available: true
          },
          {
            id: 14,
            name: 'Patates Kızartması',
            description: 'Taze patateslerden çıtır kızartma',
            price: 38,
            image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?w=600&h=800&fit=crop',
            category: 'Başlangıçlar',
            isVegetarian: true,
            calories: 320,
            ingredients: ['Patates', 'Tuz', 'Ayçiçek yağı'],
            allergens: [],
            preparationTime: 7,
            available: true
          },
          {
            id: 15,
            name: 'Zeytinyağlı Yaprak Sarma',
            description: 'Asma yaprağına sarılı nefis iç harç',
            price: 48,
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=800&fit=crop',
            category: 'Başlangıçlar',
            isVegetarian: true,
            calories: 180,
            ingredients: ['Asma yaprağı', 'Pirinç', 'Zeytinyağı', 'Soğan'],
            allergens: [],
            preparationTime: 12,
            available: true
          },
          {
            id: 16,
            name: 'Köz Patlıcan',
            description: 'Közlenmiş patlıcan, zeytinyağı ve baharatlarla',
            price: 42,
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=800&fit=crop',
            category: 'Başlangıçlar',
            isVegetarian: true,
            isGlutenFree: true,
            calories: 90,
            ingredients: ['Patlıcan', 'Zeytinyağı', 'Baharatlar'],
            allergens: [],
            preparationTime: 6,
            available: true
          }
        ]
      },
      {
        id: 2,
        name: 'Ana Yemekler',
        icon: '🍖',
        description: 'Geleneksel ve modern ana yemekler',
        items: [
          {
            id: 4,
            name: 'Adana Kebap',
            description: 'Özel baharatlarla hazırlanmış adana kebap',
            price: 120,
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=800&fit=crop',
            category: 'Ana Yemekler',
            isPopular: true,
            calories: 450,
            ingredients: ['Kuzu eti', 'Kuyruk yağı', 'Soğan', 'Maydanoz', 'Baharatlar'],
            allergens: ['Gluten'],
            preparationTime: 20,
            available: true
          },
          {
            id: 5,
            name: 'Tavuk Şiş',
            description: 'Marine edilmiş tavuk eti şiş kebap',
            price: 95,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=800&fit=crop',
            category: 'Ana Yemekler',
            calories: 380,
            ingredients: ['Tavuk göğsü', 'Zeytinyağı', 'Limon', 'Baharatlar'],
            allergens: ['Gluten'],
            preparationTime: 15,
            available: true
          },
          {
            id: 6,
            name: 'Mantı',
            description: 'El açması mantı, yoğurt ve özel sos ile',
            price: 85,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=800&fit=crop',
            category: 'Ana Yemekler',
            isPopular: true,
            calories: 320,
            ingredients: ['Un', 'Kıyma', 'Soğan', 'Yoğurt', 'Domates sosu'],
            allergens: ['Gluten', 'Süt'],
            preparationTime: 25,
            available: true
          },
          {
            id: 17,
            name: 'Izgara Somon',
            description: 'Taze somon fileto, ızgarada pişmiş',
            price: 150,
            image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=600&h=800&fit=crop',
            category: 'Ana Yemekler',
            calories: 340,
            ingredients: ['Somon', 'Zeytinyağı', 'Limon', 'Baharatlar'],
            allergens: ['Balık'],
            preparationTime: 18,
            available: true
          },
          {
            id: 18,
            name: 'Fırın Tavuk',
            description: 'Baharatlı bütün tavuk, fırında pişmiş',
            price: 135,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=800&fit=crop',
            category: 'Ana Yemekler',
            calories: 410,
            ingredients: ['Tavuk', 'Baharatlar', 'Zeytinyağı'],
            allergens: [],
            preparationTime: 22,
            available: true
          },
          {
            id: 19,
            name: 'Kuzu İncik',
            description: 'Fırında ağır ağır pişmiş kuzu incik',
            price: 180,
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=800&fit=crop',
            category: 'Ana Yemekler',
            calories: 520,
            ingredients: ['Kuzu incik', 'Baharatlar', 'Sebzeler'],
            allergens: [],
            preparationTime: 30,
            available: true
          },
          {
            id: 20,
            name: 'Sebzeli Güveç',
            description: 'Mevsim sebzeleriyle hazırlanan güveç',
            price: 90,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=800&fit=crop',
            category: 'Ana Yemekler',
            isVegetarian: true,
            calories: 210,
            ingredients: ['Patlıcan', 'Kabak', 'Domates', 'Biber', 'Baharatlar'],
            allergens: [],
            preparationTime: 16,
            available: true
          }
        ]
      },
      {
        id: 3,
        name: 'Pizzalar',
        icon: '🍕',
        description: 'İtalyan tarzı pizzalar',
        items: [
          {
            id: 7,
            name: 'Margherita',
            description: 'Domates sosu, mozzarella peyniri, fesleğen',
            price: 110,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=800&fit=crop',
            category: 'Pizzalar',
            isVegetarian: true,
            calories: 280,
            ingredients: ['Pizza hamuru', 'Domates sosu', 'Mozzarella', 'Fesleğen'],
            allergens: ['Gluten', 'Süt'],
            preparationTime: 18,
            available: true
          },
          {
            id: 8,
            name: 'Pepperoni',
            description: 'Domates sosu, mozzarella, pepperoni',
            price: 130,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=800&fit=crop',
            category: 'Pizzalar',
            isPopular: true,
            calories: 350,
            ingredients: ['Pizza hamuru', 'Domates sosu', 'Mozzarella', 'Pepperoni'],
            allergens: ['Gluten', 'Süt'],
            preparationTime: 18,
            available: true
          },
          {
            id: 21,
            name: 'Dört Peynirli',
            description: 'Mozzarella, cheddar, parmesan, rokfor',
            price: 140,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=800&fit=crop',
            category: 'Pizzalar',
            isVegetarian: true,
            calories: 320,
            ingredients: ['Pizza hamuru', 'Dört peynir', 'Domates sosu'],
            allergens: ['Gluten', 'Süt'],
            preparationTime: 20,
            available: true
          },
          {
            id: 22,
            name: 'Vejetaryen',
            description: 'Mevsim sebzeleriyle pizza',
            price: 125,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=800&fit=crop',
            category: 'Pizzalar',
            isVegetarian: true,
            calories: 270,
            ingredients: ['Pizza hamuru', 'Sebzeler', 'Mozzarella'],
            allergens: ['Gluten', 'Süt'],
            preparationTime: 19,
            available: true
          },
          {
            id: 23,
            name: 'Sucuklu',
            description: 'Sucuk, mozzarella ve domates soslu pizza',
            price: 135,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=800&fit=crop',
            category: 'Pizzalar',
            calories: 340,
            ingredients: ['Pizza hamuru', 'Sucuk', 'Mozzarella', 'Domates sosu'],
            allergens: ['Gluten', 'Süt'],
            preparationTime: 18,
            available: true
          },
          {
            id: 24,
            name: 'Ton Balıklı',
            description: 'Ton balığı, mısır ve kırmızı soğanlı pizza',
            price: 145,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=800&fit=crop',
            category: 'Pizzalar',
            calories: 310,
            ingredients: ['Pizza hamuru', 'Ton balığı', 'Mısır', 'Soğan'],
            allergens: ['Gluten', 'Balık'],
            preparationTime: 20,
            available: true
          }
        ]
      },
      {
        id: 4,
        name: 'Salatalar',
        icon: '🥗',
        description: 'Taze ve sağlıklı salatalar',
        items: [
          {
            id: 9,
            name: 'Çoban Salata',
            description: 'Domates, salatalık, soğan, peynir',
            price: 65,
            image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNhbGFkc3xlbnwwfHwwfHx8MA%3D%3D',
            category: 'Salatalar',
            isVegetarian: true,
            isGlutenFree: true,
            calories: 120,
            ingredients: ['Domates', 'Salatalık', 'Soğan', 'Beyaz peynir', 'Zeytinyağı'],
            allergens: ['Süt'],
            preparationTime: 8,
            available: true
          },
          {
            id: 10,
            name: 'Sezar Salata',
            description: 'Marul, tavuk, kruton, parmesan peyniri',
            price: 85,
            image: 'https://plus.unsplash.com/premium_photo-1690150279398-8ce7202a7523?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2FsYWRzfGVufDB8fDB8fHww',
            category: 'Salatalar',
            calories: 280,
            ingredients: ['Marul', 'Tavuk göğsü', 'Kruton', 'Parmesan', 'Sezar sosu'],
            allergens: ['Gluten', 'Süt'],
            preparationTime: 12,
            available: true
          },
          {
            id: 25,
            name: 'Akdeniz Salata',
            description: 'Yeşillikler, zeytin, domates, salatalık',
            price: 75,
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNhbGFkc3xlbnwwfHwwfHx8MA%3D%3D',
            category: 'Salatalar',
            isVegetarian: true,
            isGlutenFree: true,
            calories: 110,
            ingredients: ['Yeşillik', 'Zeytin', 'Domates', 'Salatalık'],
            allergens: [],
            preparationTime: 7,
            available: true
          },
          {
            id: 26,
            name: 'Ton Balıklı Salata',
            description: 'Ton balığı, mısır, yeşillik',
            price: 95,
            image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNhbGFkc3xlbnwwfHwwfHx8MA%3D%3D',
            category: 'Salatalar',
            calories: 160,
            ingredients: ['Ton balığı', 'Mısır', 'Yeşillik'],
            allergens: ['Balık'],
            preparationTime: 9,
            available: true
          },
          {
            id: 27,
            name: 'Kinoalı Salata',
            description: 'Kinoa, yeşillik, nar, ceviz',
            price: 90,
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=800&fit=crop',
            category: 'Salatalar',
            isVegetarian: true,
            isGlutenFree: true,
            calories: 130,
            ingredients: ['Kinoa', 'Yeşillik', 'Nar', 'Ceviz'],
            allergens: ['Ceviz'],
            preparationTime: 10,
            available: true
          },
          {
            id: 28,
            name: 'Peynirli Roka Salatası',
            description: 'Roka, beyaz peynir, ceviz',
            price: 85,
            image: 'https://plus.unsplash.com/premium_photo-1690150311132-24ce17844a92?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHNhbGFkc3xlbnwwfHwwfHx8MA%3D%3D',
            category: 'Salatalar',
            isVegetarian: true,
            isGlutenFree: true,
            calories: 140,
            ingredients: ['Roka', 'Beyaz peynir', 'Ceviz'],
            allergens: ['Süt', 'Ceviz'],
            preparationTime: 8,
            available: true
          }
        ]
      },
      {
        id: 5,
        name: 'Tatlılar',
        icon: '🍰',
        description: 'Tatlı ve nefis kapanışlar',
        items: [
          {
            id: 29,
            name: 'Baklava',
            description: 'El açması baklava, fıstık ile',
            price: 85,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=800&fit=crop',
            category: 'Tatlılar',
            isPopular: true,
            calories: 380,
            ingredients: ['Yufka', 'Fıstık', 'Şerbet', 'Tereyağı'],
            allergens: ['Gluten', 'Fındık'],
            preparationTime: 12,
            available: true
          },
          {
            id: 30,
            name: 'Sütlaç',
            description: 'Fırınlanmış sütlaç',
            price: 55,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=800&fit=crop',
            category: 'Tatlılar',
            calories: 210,
            ingredients: ['Süt', 'Pirinç', 'Şeker'],
            allergens: ['Süt'],
            preparationTime: 8,
            available: true
          },
          {
            id: 31,
            name: 'Tiramisu',
            description: 'Kahveli, mascarpone kremalı İtalyan tatlısı',
            price: 70,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=800&fit=crop',
            category: 'Tatlılar',
            calories: 320,
            ingredients: ['Kedi dili', 'Kahve', 'Mascarpone', 'Kakao'],
            allergens: ['Gluten', 'Süt', 'Yumurta'],
            preparationTime: 10,
            available: true
          },
          {
            id: 32,
            name: 'Profiterol',
            description: 'Çikolatalı profiterol',
            price: 65,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=800&fit=crop',
            category: 'Tatlılar',
            calories: 290,
            ingredients: ['Un', 'Yumurta', 'Çikolata', 'Süt'],
            allergens: ['Gluten', 'Süt', 'Yumurta'],
            preparationTime: 9,
            available: true
          },
          {
            id: 33,
            name: 'Cheesecake',
            description: 'Frambuazlı cheesecake',
            price: 80,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=800&fit=crop',
            category: 'Tatlılar',
            calories: 340,
            ingredients: ['Labne', 'Bisküvi', 'Frambuaz'],
            allergens: ['Gluten', 'Süt', 'Yumurta'],
            preparationTime: 11,
            available: true
          },
          {
            id: 34,
            name: 'Dondurma',
            description: 'Çeşit çeşit dondurma topları',
            price: 35,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=800&fit=crop',
            category: 'Tatlılar',
            calories: 180,
            ingredients: ['Süt', 'Şeker', 'Meyve'],
            allergens: ['Süt'],
            preparationTime: 5,
            available: true
          }
        ]
      }
    ];
  }

  selectCategory(category: MenuCategory) {
    this.selectedCategory = category;
  }

  getFilteredItems(): MenuItem[] {
    if (!this.selectedCategory) return [];

    let items = this.selectedCategory.items;

    // Search filter
    if (this.searchTerm) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Availability filter
    if (this.showOnlyAvailable) {
      items = items.filter(item => item.available);
    }

    // Vegetarian filter
    if (this.showOnlyVegetarian) {
      items = items.filter(item => item.isVegetarian);
    }

    // Gluten free filter
    if (this.showOnlyGlutenFree) {
      items = items.filter(item => item.isGlutenFree);
    }

    // Price filter
    items = items.filter(item => item.price <= this.maxPrice);

    // Sort
    switch (this.sortBy) {
      case 'name':
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'popularity':
        items.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
    }

    return items;
  }

  openItemModal(item: MenuItem) {
    this.selectedItem = item;
    this.selectedQuantity = 1;
    this.specialRequests = '';
    this.showItemModal = true;
  }

  closeItemModal() {
    this.showItemModal = false;
    this.selectedItem = null;
  }

  addToCart() {
    if (!this.selectedItem) return;

    const existingItem = this.cart.find(cartItem => cartItem.item.id === this.selectedItem!.id);
    
    if (existingItem) {
      existingItem.quantity += this.selectedQuantity;
      if (this.specialRequests) {
        existingItem.specialRequests = this.specialRequests;
      }
    } else {
      this.cart.push({
        item: this.selectedItem,
        quantity: this.selectedQuantity,
        specialRequests: this.specialRequests
      });
    }

    this.closeItemModal();
    this.showCart = true;
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
    if (this.cart.length === 0) {
      this.showCart = false;
    }
  }

  updateQuantity(index: number, change: number) {
    const newQuantity = this.cart[index].quantity + change;
    if (newQuantity > 0) {
      this.cart[index].quantity = newQuantity;
    } else {
      this.removeFromCart(index);
    }
  }

  getCartTotal(): number {
    return this.cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);
  }

  getCartItemCount(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  clearCart() {
    this.cart = [];
    this.showCart = false;
  }

  placeOrder() {
    // Burada sipariş verme işlemi yapılacak
    console.log('Sipariş veriliyor:', this.cart);
    alert('Siparişiniz alındı! Teşekkürler.');
    this.clearCart();
  }

  getItemImage(item: MenuItem): string {
    return item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop';
  }

  getPriceFormatted(price: number): string {
    return price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
  }

  increaseQuantity() {
    this.selectedQuantity++;
  }

  decreaseQuantity() {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }

  quickAddToCart(item: MenuItem) {
    const existingItem = this.cart.find(cartItem => cartItem.item.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        item: item,
        quantity: 1
      });
    }
    
    this.showCart = true;
  }

  setViewMode(mode: 'grid-2' | 'grid-4' | 'list') {
    this.viewMode = mode;
  }

  getInstagramCardClass(index: number): string {
    // Instagram tarzı farklı boyutlarda kartlar
    const patterns = [
      'aspect-square', // 1:1
      'aspect-[4/5]',  // 4:5 (daha uzun)
      'aspect-square', // 1:1
      'aspect-[5/4]',  // 5:4 (daha geniş)
      'aspect-[4/5]',  // 4:5
      'aspect-square', // 1:1
      'aspect-[5/4]',  // 5:4
      'aspect-square', // 1:1
    ];
    
    return patterns[index % patterns.length];
  }
  
  getRandomHeight(index: number): string {
    // Her ürün için tamamen rastgele yükseklik (180px-340px arası)
    const min = 180;
    const max = 340;
    const px = Math.floor(Math.random() * (max - min + 1)) + min;
    return px + 'px';
  }
  
  // Footer Menu Methods
  toggleSearch() {
    this.showSearch = !this.showSearch;
    this.showViewMode = false;
  }
  
  toggleViewMode() {
    this.showViewMode = !this.showViewMode;
    this.showSearch = false;
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Close view mode dropdown when clicking outside
    const target = event.target as HTMLElement;
    const viewModeButton = target.closest('.view-mode-button');
    const viewModeDropdown = target.closest('.view-mode-dropdown');
    
    if (!viewModeButton && !viewModeDropdown && this.showViewMode) {
      this.showViewMode = false;
    }
  }
} 