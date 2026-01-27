import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  forgotForm: FormGroup;
  resetForm: FormGroup;
  hide = true;
  hideNew = true;
  hideConfirm = true;

  // States: 'login', 'forgot', 'reset'
  currentMode: 'login' | 'forgot' | 'reset' = 'login';
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      tempPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void { }

  passwordMatchValidator(g: FormGroup) {
    const newPassword = g.get('newPassword')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { 'mismatch': true };
  }

  get f() { return this.loginForm.controls; }
  get forgotF() { return this.forgotForm.controls; }
  get resetF() { return this.resetForm.controls; }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    // Mock authentication
    if (email === 'lokeshkumarkanuboina@gmail.com' && password === 'lokesh') {
      localStorage.setItem('isAuthenticated', 'true');
      this.router.navigate(['/core/outlet-onboarding']);
    } else {
      this.errorMessage = 'Invalid email or password';
      setTimeout(() => this.errorMessage = null, 3000);
    }
  }

  onForgotSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    console.log('Sending temporary password to:', this.forgotForm.value.email);
    // Simulate sending email
    this.currentMode = 'reset';
    this.successMessage = 'A temporary password has been sent to your email.';
    setTimeout(() => this.successMessage = null, 5000);
  }

  onResetSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    console.log('Password updated successfully');
    this.currentMode = 'login';
    this.successMessage = 'Password updated successfully. Please login with your new password.';
    this.loginForm.reset();
    this.forgotForm.reset();
    this.resetForm.reset();
    setTimeout(() => this.successMessage = null, 5000);
  }

  setMode(mode: 'login' | 'forgot' | 'reset'): void {
    this.currentMode = mode;
    this.successMessage = null;
    this.errorMessage = null;
  }

  togglePassword(field: string = 'hide'): void {
    if (field === 'hide') this.hide = !this.hide;
    if (field === 'hideNew') this.hideNew = !this.hideNew;
    if (field === 'hideConfirm') this.hideConfirm = !this.hideConfirm;
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    this.setMode('forgot');
  }
}