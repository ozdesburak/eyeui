import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, NgIf, ButtonComponent, NgClass],
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType!: boolean;
  loading = false;
  error: string | null = null;

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly http: HttpClient
  ) {}

  onClick() {
    console.log('Button clicked');
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  async onSubmit() {
    this.submitted = true;
    this.error = null;
    const { email, password } = this.form.value;

    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    try {
      const res = await this.http.post<{ access_token: string }>('http://localhost:3000/auth/signin', {
        email,
        password,
      }).toPromise();
      // Token'ı localStorage'a kaydet (isteğe bağlı)
      if (res && res.access_token) {
        localStorage.setItem('access_token', res.access_token);
      }
      this._router.navigate(['/restaurant/dashboard']);
    } catch (err: any) {
      this.error = err?.error?.message || 'Giriş başarısız.';
    } finally {
      this.loading = false;
    }
  }
}
