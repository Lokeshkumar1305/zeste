import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
selector: 'app-login',
templateUrl: './login.component.html',
styleUrls: ['./login.component.scss']
})
export class LoginComponent {
loginForm: FormGroup;
hide = true;

constructor(private fb: FormBuilder, private router: Router) {
this.loginForm = this.fb.group({
email: ['', [Validators.required, Validators.email]],
password: ['', [Validators.required, Validators.minLength(6)]]
});
}

get f() { return this.loginForm.controls; }

onSubmit(): void {
  const { email, password } = this.loginForm.value;
  if (email === 'lokeshkumarkanuboina@gmail.com' && password === 'lokesh') {
    localStorage.setItem('isAuthenticated', 'true');
    this.router.navigate(['/core/outlet-onboarding']).then(success => {
      console.log('Navigation success:', success);
    }).catch(err => {
      console.error('Navigation error:', err);
    });
  } else {
    this.loginForm.markAllAsTouched();
    console.log('Invalid credentials');
  }
}

togglePassword(): void {
this.hide = !this.hide;
}

onForgotPassword(event: Event): void {
event.preventDefault();
// TODO: route to your Forgot Password page
console.log('Forgot password clicked');
// this.router.navigate(['/forgot-password']);
}
}