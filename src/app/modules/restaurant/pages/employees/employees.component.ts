import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Employee {
  id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  hireDate: Date;
  salary: number;
  status: 'active' | 'inactive' | 'on_leave';
  avatar?: string;
  department: string;
  workingHours: string;
  password?: string;
  role?: string;
}

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm: string = '';
  selectedStatus: string = 'all';
  selectedDepartment: string = 'all';
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  selectedEmployee: Employee | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  newEmployee: Partial<Employee> = {
    name: '',
    position: '',
    email: '',
    phone: '',
    salary: 0,
    status: 'active',
    department: '',
    workingHours: '',
    role: 'waiter'
  };

  departments = [
    'Mutfak',
    'Servis',
    'Bar',
    'Temizlik',
    'Yönetim',
    'Kasa'
  ];

  positions = [
    'Şef',
    'Aşçı',
    'Garson',
    'Barista',
    'Temizlik Görevlisi',
    'Kasiyer',
    'Müdür',
    'Yardımcı'
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadEmployees();
  }

  async loadEmployees() {
    this.loading = true;
    this.error = null;
    try {
      const token = localStorage.getItem('access_token');
      const employees: any = await this.http.get('http://localhost:3000/users/employees', {
        headers: { Authorization: `Bearer ${token}` }
      }).toPromise();
      this.employees = employees.map((e: any, i: number) => ({
        id: e._id,
        name: e.name,
        position: e.position,
        email: e.email,
        phone: e.phone,
        hireDate: e.hireDate ? new Date(e.hireDate) : new Date(),
        salary: e.salary || 0,
        status: e.status || 'active',
        department: e.department || '',
        workingHours: e.workingHours || '',
        avatar: e.avatar || undefined
      }));
      this.filterEmployees();
    } catch (err: any) {
      this.error = err?.error?.message || 'Çalışanlar yüklenemedi.';
    } finally {
      this.loading = false;
    }
  }

  filterEmployees() {
    this.filteredEmployees = this.employees.filter(employee => {
      const matchesSearch = employee.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           employee.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           employee.position.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.selectedStatus === 'all' || employee.status === this.selectedStatus;
      const matchesDepartment = this.selectedDepartment === 'all' || employee.department === this.selectedDepartment;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });
    this.currentPage = 1;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Aktif';
      case 'inactive': return 'Pasif';
      case 'on_leave': return 'İzinde';
      default: return 'Bilinmiyor';
    }
  }

  openAddModal() {
    this.newEmployee = {
      name: '',
      position: '',
      email: '',
      phone: '',
      salary: 0,
      status: 'active',
      department: '',
      workingHours: '',
      role: 'waiter'
    };
    this.showAddModal = true;
  }

  openEditModal(employee: Employee) {
    this.selectedEmployee = { ...employee };
    this.showEditModal = true;
  }

  closeModals() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.selectedEmployee = null;
  }

  async addEmployee() {
    if (this.newEmployee.name && this.newEmployee.position && this.newEmployee.email) {
      this.loading = true;
      this.error = null;
      this.success = null;
      try {
        const token = localStorage.getItem('access_token');
        await this.http.post('http://localhost:3000/users/employees', {
          name: this.newEmployee.name,
          email: this.newEmployee.email,
          password: this.newEmployee.password || '123456',
          role: this.newEmployee.role || 'waiter',
          phone: this.newEmployee.phone,
          department: this.newEmployee.department,
          position: this.newEmployee.position,
          salary: this.newEmployee.salary,
          status: this.newEmployee.status,
          hireDate: new Date(),
        }, {
          headers: { Authorization: `Bearer ${token}` }
        }).toPromise();
        this.success = 'Çalışan başarıyla eklendi.';
        // Formu resetle
        this.newEmployee = {
          name: '',
          position: '',
          email: '',
          phone: '',
          salary: 0,
          status: 'active',
          department: '',
          workingHours: '',
          password: '',
          role: 'waiter'
        };
        this.closeModals();
        await this.loadEmployees();
      } catch (err: any) {
        this.error = err?.error?.message || 'Çalışan eklenemedi.';
      } finally {
        this.loading = false;
      }
    }
  }

  async updateEmployee() {
    if (this.selectedEmployee) {
      this.loading = true;
      this.error = null;
      this.success = null;
      try {
        const token = localStorage.getItem('access_token');
        await this.http.put(`http://localhost:3000/users/employees/${this.selectedEmployee.id}`, {
          name: this.selectedEmployee.name,
          email: this.selectedEmployee.email,
          phone: this.selectedEmployee.phone,
          department: this.selectedEmployee.department,
          position: this.selectedEmployee.position,
          salary: this.selectedEmployee.salary,
          status: this.selectedEmployee.status,
          hireDate: this.selectedEmployee.hireDate,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        }).toPromise();
        this.success = 'Çalışan başarıyla güncellendi.';
        this.closeModals();
        await this.loadEmployees();
      } catch (err: any) {
        this.error = err?.error?.message || 'Çalışan güncellenemedi.';
      } finally {
        this.loading = false;
      }
    }
  }

  deleteEmployee(id: number) {
    if (confirm('Bu çalışanı silmek istediğinizden emin misiniz?')) {
      this.employees = this.employees.filter(e => e.id !== id);
      this.filterEmployees();
    }
  }

  get paginatedEmployees() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEmployees.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getStats() {
    const total = this.employees.length;
    const active = this.employees.filter(e => e.status === 'active').length;
    const onLeave = this.employees.filter(e => e.status === 'on_leave').length;
    const totalSalary = this.employees.reduce((sum, e) => sum + e.salary, 0);
    
    return { total, active, onLeave, totalSalary };
  }
} 