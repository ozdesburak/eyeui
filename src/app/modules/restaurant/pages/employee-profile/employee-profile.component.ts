import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

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
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {
  Math = Math; // Template'de Math kullanımı için
  employee: Employee | null = null;
  leaveRequests: LeaveRequest[] = [];
  shifts: Shift[] = [];
  attendances: Attendance[] = [];
  
  activeTab: string = 'profile';
  showLeaveModal: boolean = false;
  
  newLeaveRequest: Partial<LeaveRequest> = {
    startDate: new Date(),
    endDate: new Date(),
    type: 'annual',
    reason: '',
    status: 'pending'
  };

  leaveTypes = [
    { value: 'annual', label: 'Yıllık İzin' },
    { value: 'sick', label: 'Hastalık İzni' },
    { value: 'personal', label: 'Kişisel İzin' },
    { value: 'maternity', label: 'Doğum İzni' },
    { value: 'paternity', label: 'Babalar İzni' }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const employeeId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Employee ID:', employeeId);
    this.loadEmployeeData(employeeId);
  }

  loadEmployeeData(employeeId: number) {
    console.log('Loading employee data for ID:', employeeId);
    // Dummy employee data - çalışanın kendi bilgileri
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

  closeModals() {
    this.showLeaveModal = false;
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
    switch (type) {
      case 'morning': return 'Sabah (06:00-14:00)';
      case 'afternoon': return 'Öğleden Sonra (14:00-22:00)';
      case 'night': return 'Gece (22:00-06:00)';
      case 'split': return 'Bölünmüş Vardiya';
      default: return type;
    }
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

  getTotalWorkHours(): number {
    return this.attendances.reduce((total, attendance) => {
      return total + (attendance.totalHours || 0);
    }, 0);
  }
} 