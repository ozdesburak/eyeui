import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';

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
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  birthDate?: Date;
  idNumber?: string;
  bankAccount?: string;
}

interface LeaveRequest {
  id: number;
  employeeId: number;
  startDate: Date;
  endDate: Date;
  type: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: Date;
}

interface Shift {
  id: number;
  employeeId: number;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'morning' | 'afternoon' | 'night' | 'split';
  status: 'scheduled' | 'completed' | 'absent' | 'late';
  notes?: string;
}

interface Performance {
  id: number;
  employeeId: number;
  date: Date;
  rating: number; // 1-5
  category: 'service' | 'kitchen' | 'cleaning' | 'management';
  comments: string;
  evaluator: string;
}

interface Attendance {
  id: number;
  employeeId: number;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  totalHours?: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
}

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | null = null;
  leaveRequests: LeaveRequest[] = [];
  shifts: Shift[] = [];
  performances: Performance[] = [];
  attendances: Attendance[] = [];
  
  activeTab: string = 'profile';
  showLeaveModal: boolean = false;
  showShiftModal: boolean = false;
  showPerformanceModal: boolean = false;
  
  // Math objesini template'de kullanabilmek için
  Math = Math;
  
  newLeaveRequest: Partial<LeaveRequest> = {
    startDate: new Date(),
    endDate: new Date(),
    type: 'annual',
    reason: '',
    status: 'pending'
  };
  
  newShift: Partial<Shift> = {
    date: new Date(),
    startTime: '09:00',
    endTime: '17:00',
    type: 'morning',
    status: 'scheduled'
  };
  
  newPerformance: Partial<Performance> = {
    date: new Date(),
    rating: 5,
    category: 'service',
    comments: '',
    evaluator: 'Yönetici'
  };

  leaveTypes = [
    { value: 'annual', label: 'Yıllık İzin' },
    { value: 'sick', label: 'Hastalık İzni' },
    { value: 'personal', label: 'Kişisel İzin' },
    { value: 'maternity', label: 'Doğum İzni' },
    { value: 'paternity', label: 'Babalar İzni' }
  ];

  shiftTypes = [
    { value: 'morning', label: 'Sabah (06:00-14:00)' },
    { value: 'afternoon', label: 'Öğleden Sonra (14:00-22:00)' },
    { value: 'night', label: 'Gece (22:00-06:00)' },
    { value: 'split', label: 'Bölünmüş Vardiya' }
  ];

  performanceCategories = [
    { value: 'service', label: 'Servis Kalitesi' },
    { value: 'kitchen', label: 'Mutfak Performansı' },
    { value: 'cleaning', label: 'Temizlik' },
    { value: 'management', label: 'Yönetim' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEmployeeData(employeeId);
  }

  loadEmployeeData(employeeId: number) {
    // Dummy employee data
    this.employee = {
      id: employeeId,
      name: 'Ahmet Yılmaz',
      position: 'Şef',
      email: 'ahmet@restaurant.com',
      phone: '0532 123 4567',
      hireDate: new Date('2022-01-15'),
      salary: 8500,
      status: 'active',
      department: 'Mutfak',
      workingHours: '08:00-17:00',
      avatar: 'assets/avatars/avt-01.jpg',
      address: 'Kadıköy, İstanbul',
      emergencyContact: 'Fatma Yılmaz',
      emergencyPhone: '0533 987 6543',
      birthDate: new Date('1985-03-15'),
      idNumber: '12345678901',
      bankAccount: 'TR12 3456 7890 1234 5678 90'
    };

    this.loadLeaveRequests(employeeId);
    this.loadShifts(employeeId);
    this.loadPerformances(employeeId);
    this.loadAttendances(employeeId);
  }

  loadLeaveRequests(employeeId: number) {
    this.leaveRequests = [
      {
        id: 1,
        employeeId: employeeId,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-20'),
        type: 'annual',
        reason: 'Aile ziyareti',
        status: 'approved',
        approvedBy: 'Restoran Müdürü',
        approvedDate: new Date('2024-01-10')
      },
      {
        id: 2,
        employeeId: employeeId,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-03'),
        type: 'sick',
        reason: 'Grip',
        status: 'approved',
        approvedBy: 'Restoran Müdürü',
        approvedDate: new Date('2024-01-31')
      },
      {
        id: 3,
        employeeId: employeeId,
        startDate: new Date('2024-03-10'),
        endDate: new Date('2024-03-12'),
        type: 'personal',
        reason: 'Kişisel işler',
        status: 'pending'
      }
    ];
  }

  loadShifts(employeeId: number) {
    this.shifts = [
      {
        id: 1,
        employeeId: employeeId,
        date: new Date('2024-01-15'),
        startTime: '08:00',
        endTime: '17:00',
        type: 'morning',
        status: 'completed',
        notes: 'Normal vardiya'
      },
      {
        id: 2,
        employeeId: employeeId,
        date: new Date('2024-01-16'),
        startTime: '08:00',
        endTime: '17:00',
        type: 'morning',
        status: 'completed'
      },
      {
        id: 3,
        employeeId: employeeId,
        date: new Date('2024-01-17'),
        startTime: '14:00',
        endTime: '23:00',
        type: 'afternoon',
        status: 'scheduled'
      }
    ];
  }

  loadPerformances(employeeId: number) {
    this.performances = [
      {
        id: 1,
        employeeId: employeeId,
        date: new Date('2024-01-10'),
        rating: 5,
        category: 'kitchen',
        comments: 'Mükemmel yemek kalitesi, hızlı servis',
        evaluator: 'Restoran Müdürü'
      },
      {
        id: 2,
        employeeId: employeeId,
        date: new Date('2024-01-15'),
        rating: 4,
        category: 'management',
        comments: 'İyi liderlik, ekip yönetimi başarılı',
        evaluator: 'Genel Müdür'
      }
    ];
  }

  loadAttendances(employeeId: number) {
    this.attendances = [
      {
        id: 1,
        employeeId: employeeId,
        date: new Date('2024-01-15'),
        checkIn: new Date('2024-01-15T08:00:00'),
        checkOut: new Date('2024-01-15T17:00:00'),
        totalHours: 9,
        status: 'present'
      },
      {
        id: 2,
        employeeId: employeeId,
        date: new Date('2024-01-16'),
        checkIn: new Date('2024-01-16T08:15:00'),
        checkOut: new Date('2024-01-16T17:00:00'),
        totalHours: 8.75,
        status: 'late'
      },
      {
        id: 3,
        employeeId: employeeId,
        date: new Date('2024-01-17'),
        checkIn: new Date('2024-01-17T08:00:00'),
        checkOut: new Date('2024-01-17T17:00:00'),
        totalHours: 9,
        status: 'present'
      }
    ];
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  openLeaveModal() {
    this.newLeaveRequest = {
      startDate: new Date(),
      endDate: new Date(),
      type: 'annual',
      reason: '',
      status: 'pending'
    };
    this.showLeaveModal = true;
  }

  openShiftModal() {
    this.newShift = {
      date: new Date(),
      startTime: '09:00',
      endTime: '17:00',
      type: 'morning',
      status: 'scheduled'
    };
    this.showShiftModal = true;
  }

  openPerformanceModal() {
    this.newPerformance = {
      date: new Date(),
      rating: 5,
      category: 'service',
      comments: '',
      evaluator: 'Yönetici'
    };
    this.showPerformanceModal = true;
  }

  closeModals() {
    this.showLeaveModal = false;
    this.showShiftModal = false;
    this.showPerformanceModal = false;
  }

  submitLeaveRequest() {
    if (this.newLeaveRequest.startDate && this.newLeaveRequest.endDate && this.newLeaveRequest.reason) {
      const leaveRequest: LeaveRequest = {
        id: this.leaveRequests.length + 1,
        employeeId: this.employee!.id,
        startDate: this.newLeaveRequest.startDate!,
        endDate: this.newLeaveRequest.endDate!,
        type: this.newLeaveRequest.type!,
        reason: this.newLeaveRequest.reason!,
        status: 'pending'
      };
      
      this.leaveRequests.push(leaveRequest);
      this.closeModals();
    }
  }

  submitShift() {
    if (this.newShift.date && this.newShift.startTime && this.newShift.endTime) {
      const shift: Shift = {
        id: this.shifts.length + 1,
        employeeId: this.employee!.id,
        date: this.newShift.date!,
        startTime: this.newShift.startTime!,
        endTime: this.newShift.endTime!,
        type: this.newShift.type!,
        status: 'scheduled',
        notes: this.newShift.notes
      };
      
      this.shifts.push(shift);
      this.closeModals();
    }
  }

  submitPerformance() {
    if (this.newPerformance.comments && this.newPerformance.category) {
      const performance: Performance = {
        id: this.performances.length + 1,
        employeeId: this.employee!.id,
        date: this.newPerformance.date!,
        rating: this.newPerformance.rating!,
        category: this.newPerformance.category!,
        comments: this.newPerformance.comments!,
        evaluator: this.newPerformance.evaluator!
      };
      
      this.performances.push(performance);
      this.closeModals();
    }
  }

  approveLeave(leaveId: number) {
    const leave = this.leaveRequests.find(l => l.id === leaveId);
    if (leave) {
      leave.status = 'approved';
      leave.approvedBy = 'Restoran Müdürü';
      leave.approvedDate = new Date();
    }
  }

  rejectLeave(leaveId: number) {
    const leave = this.leaveRequests.find(l => l.id === leaveId);
    if (leave) {
      leave.status = 'rejected';
      leave.approvedBy = 'Restoran Müdürü';
      leave.approvedDate = new Date();
    }
  }

  getLeaveStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getLeaveStatusText(status: string): string {
    switch (status) {
      case 'approved': return 'Onaylandı';
      case 'rejected': return 'Reddedildi';
      case 'pending': return 'Beklemede';
      default: return 'Bilinmiyor';
    }
  }

  getShiftStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getShiftStatusText(status: string): string {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'scheduled': return 'Planlandı';
      case 'absent': return 'Gelmedi';
      case 'late': return 'Geç Geldi';
      default: return 'Bilinmiyor';
    }
  }

  getAttendanceStatusClass(status: string): string {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'half-day': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getAttendanceStatusText(status: string): string {
    switch (status) {
      case 'present': return 'Mevcut';
      case 'absent': return 'Yok';
      case 'late': return 'Geç';
      case 'half-day': return 'Yarım Gün';
      default: return 'Bilinmiyor';
    }
  }

  getLeaveTypeText(type: string): string {
    const leaveType = this.leaveTypes.find(lt => lt.value === type);
    return leaveType ? leaveType.label : type;
  }

  getShiftTypeText(type: string): string {
    const shiftType = this.shiftTypes.find(st => st.value === type);
    return shiftType ? shiftType.label : type;
  }

  getPerformanceCategoryText(category: string): string {
    const perfCategory = this.performanceCategories.find(pc => pc.value === category);
    return perfCategory ? perfCategory.label : category;
  }

  getAverageRating(): number {
    if (this.performances.length === 0) return 0;
    const total = this.performances.reduce((sum, p) => sum + p.rating, 0);
    return Math.round((total / this.performances.length) * 10) / 10;
  }

  getTotalLeaveDays(): number {
    return this.leaveRequests
      .filter(l => l.status === 'approved')
      .reduce((total, leave) => {
        const days = Math.ceil((leave.endDate.getTime() - leave.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return total + days;
      }, 0);
  }

  getAttendanceRate(): number {
    if (this.attendances.length === 0) return 0;
    const present = this.attendances.filter(a => a.status === 'present').length;
    return Math.round((present / this.attendances.length) * 100);
  }

  goBack() {
    this.router.navigate(['/restaurant/employees']);
  }
} 