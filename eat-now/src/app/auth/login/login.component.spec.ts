import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        NoopAnimationsModule
      ],
      declarations: [LoginComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load the component with correct stylesheet classes', () => {
    const showScrollElement = fixture.debugElement.query(By.css('.show-scroll'));
    expect(showScrollElement).toBeTruthy();
    const loginCardElement = fixture.debugElement.query(By.css('.login-card'));
    expect(loginCardElement).toBeTruthy();
    expect(loginCardElement.nativeElement.classList.contains('login-card')).toBeTrue();
  });

  it('should initialize the form with email and password controls', () => {
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should make the email field required', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBeTrue();
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTrue();
    emailControl?.setValue('test@example.com');
    expect(emailControl?.hasError('email')).toBeFalse();
  });

  it('should make the password field required', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.hasError('required')).toBeTrue();
  });

  it('should enforce minimum password length of 6 characters', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('12345');
    expect(passwordControl?.hasError('minlength')).toBeTrue();
    passwordControl?.setValue('123456');
    expect(passwordControl?.hasError('minlength')).toBeFalse();
  });

  it('should disable login button when form is invalid', () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeTrue();
    component.loginForm.setValue({ email: 'test@example.com', password: '123456' });
    fixture.detectChanges();
    expect(button.disabled).toBeFalse();
  });

  it('should toggle password visibility', () => {
    const passwordInput = fixture.debugElement.query(By.css('input[formControlName="password"]')).nativeElement;
    const toggleButton = fixture.debugElement.query(By.css('button[matSuffix]')).nativeElement;
    expect(passwordInput.type).toBe('password');
    toggleButton.click();
    fixture.detectChanges();
    expect(passwordInput.type).toBe('text');
    toggleButton.click();
    fixture.detectChanges();
    expect(passwordInput.type).toBe('password');
  });

  it('should call onSubmit when form is submitted with valid data', () => {
    spyOn(component, 'onSubmit');
    component.loginForm.setValue({ email: 'test@example.com', password: '123456' });
    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should call onForgotPassword when forgot password link is clicked', () => {
    spyOn(component, 'onForgotPassword');
    const forgotPasswordLink = fixture.debugElement.query(By.css('a.text-success')).nativeElement;
    forgotPasswordLink.click();
    fixture.detectChanges();
    expect(component.onForgotPassword).toHaveBeenCalled();
  });

  it('should display error messages for invalid email', () => {
    component.loginForm.get('email')?.setValue('');
    fixture.detectChanges();
    const emailError = fixture.debugElement.query(By.css('mat-error')).nativeElement;
    expect(emailError.textContent).toContain('Email is required');
  });

  it('should display error messages for invalid password', () => {
    component.loginForm.get('password')?.setValue('123');
    fixture.detectChanges();
    const passwordError = fixture.debugElement.queryAll(By.css('mat-error'))[1]?.nativeElement;
    expect(passwordError?.textContent).toContain('Password must be at least 6 characters');
  });
});