import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
    profileForm: FormGroup;
    passwordForm: FormGroup;
    isViewMode = true;
    user = {
        name: 'Lokesh Kumar Kanuboina',
        email: 'lokeshkumarkanuboina@gmail.com',
        mobile: '+91 9876543210',
        designation: 'Super Admin',
        location: 'Hyderabad, India',
        avatar: 'assets/images/avatar-placeholder.png'
    };

    hideOld = true;
    hideNew = true;
    hideConfirm = true;

    constructor(private fb: FormBuilder) {
        this.profileForm = this.fb.group({
            name: [this.user.name, Validators.required],
            email: [this.user.email, [Validators.required, Validators.email]],
            mobile: [this.user.mobile, Validators.required],
            designation: [this.user.designation, Validators.required],
            location: [this.user.location]
        });

        this.passwordForm = this.fb.group({
            oldPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit(): void { }

    passwordMatchValidator(g: FormGroup) {
        return g.get('newPassword')?.value === g.get('confirmPassword')?.value
            ? null : { 'mismatch': true };
    }

    toggleEdit(): void {
        this.isViewMode = !this.isViewMode;
        if (this.isViewMode) {
            this.profileForm.patchValue(this.user);
        }
    }

    onSaveProfile(): void {
        if (this.profileForm.valid) {
            this.user = { ...this.user, ...this.profileForm.value };
            this.isViewMode = true;
            console.log('Profile saved:', this.user);
        }
    }

    onChangePassword(): void {
        if (this.passwordForm.valid) {
            console.log('Password change requested');
            this.passwordForm.reset();
        }
    }

    togglePassword(field: string): void {
        if (field === 'old') this.hideOld = !this.hideOld;
        if (field === 'new') this.hideNew = !this.hideNew;
        if (field === 'confirm') this.hideConfirm = !this.hideConfirm;
    }
}
