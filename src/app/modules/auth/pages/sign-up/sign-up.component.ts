import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  standalone: true,
  imports: [FormsModule, ButtonComponent],
})
export class SignUpComponent implements OnInit {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  restaurantName = '';
  error = '';
  loading = false;

  // Sabit değerler
  readonly role = 'restaurant_owner';
  readonly restaurantId = 'REPLACE_WITH_RESTAURANT_ID'; // Buraya gerçek bir restoran id'si girilmeli

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    this.error = '';
    if (!this.name || !this.email || !this.password || !this.confirmPassword || !this.restaurantName) {
      this.error = 'All fields are required.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    this.loading = true;
    this.http.post('http://localhost:3000/auth/signup', {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
      restaurantName: this.restaurantName,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/auth/sign-in']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Sign up failed.';
      },
    });
  }
}
