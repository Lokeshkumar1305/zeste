import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';


interface Role {
  id: number;
  name: string;
  description: string;
  selected: boolean;
}

interface Permission {
  id: number;
  function: string;
  create: boolean;
  edit: boolean;
  editLabel?: string;
}

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  businessType: string;
  countryCode: string;
}

interface Role {
  name: string;
  description: string;
  selected: boolean;
}



@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  userForm!: FormGroup;
  
  businessTypes: string[] = [
    'Retail',
    'Wholesale',
    'Manufacturing',
    'Services',
    'Technology',
    'Healthcare',
    'Education',
    'Other'
  ];

  roles: Role[] = [
    { id: 1, name: 'Admin', description: 'Full system access', selected: false },
    { id: 2, name: 'Manager', description: 'Team management, reports', selected: false },
    { id: 3, name: 'Editor', description: 'Content editing, publishing', selected: false },
    { id: 4, name: 'Viewer', description: 'Read-only access', selected: false },
    { id: 5, name: 'Support', description: 'Customer support access', selected: false }
  ];

  permissions: Permission[] = [
    { id: 1, function: 'User Management', create: false, edit: false, editLabel: '' },
    { id: 2, function: 'Content Management', create: false, edit: false, editLabel: '' },
    { id: 3, function: 'Reports', create: false, edit: false, editLabel: '' },
    { id: 4, function: 'Settings', create: false, edit: false, editLabel: '' },
    { id: 5, function: 'Analytics', create: false, edit: false, editLabel: '' }
  ];

  roleDisplayedColumns: string[] = ['select', 'name', 'description'];
  permissionDisplayedColumns: string[] = ['function', 'create', 'edit'];

  constructor(private fb: FormBuilder,private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+91', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      businessType: ['', [Validators.required]]
    });
  }

  // Toggle role selection via checkbox
  toggleRole(role: Role, event: MatCheckboxChange): void {
    role.selected = event.checked;
    this.updatePermissionsBasedOnRoles();
    console.log('Role toggled:', role.name, 'Selected:', role.selected);
  }

  // Handle row click (toggle the role)
  onRowClick(role: Role): void {
    role.selected = !role.selected;
    this.updatePermissionsBasedOnRoles();
    console.log('Row clicked:', role.name, 'Selected:', role.selected);
  }

  // Update permissions based on selected roles
  updatePermissionsBasedOnRoles(): void {
    const selectedRoles = this.roles.filter(r => r.selected);
    
    // Reset permissions
    this.permissions.forEach(p => {
      p.create = false;
      p.edit = false;
      p.editLabel = '';
    });

    // Apply permissions based on selected roles
    selectedRoles.forEach(role => {
      switch (role.name) {
        case 'Admin':
          this.permissions.forEach(p => {
            p.create = true;
            p.edit = true;
            p.editLabel = 'Full Access';
          });
          break;
        case 'Manager':
          this.permissions.forEach(p => {
            p.create = true;
            p.edit = true;
            p.editLabel = 'Team Level';
          });
          break;
        case 'Editor':
          const contentPerm = this.permissions.find(p => p.function === 'Content Management');
          if (contentPerm) {
            contentPerm.create = true;
            contentPerm.edit = true;
            contentPerm.editLabel = 'Content Only';
          }
          break;
        case 'Viewer':
          // Viewer has no create/edit permissions
          break;
        case 'Support':
          const userPerm = this.permissions.find(p => p.function === 'User Management');
          if (userPerm) {
            userPerm.edit = true;
            userPerm.editLabel = 'Support Level';
          }
          break;
      }
    });

    // Force table to refresh
    this.permissions = [...this.permissions];
  }

  // Toggle individual permission
  togglePermission(permission: Permission, type: 'create' | 'edit', event: MatSlideToggleChange): void {
    permission[type] = event.checked;
    
    if (type === 'edit') {
      permission.editLabel = event.checked ? 'Custom' : '';
    }
    
    console.log('Permission toggled:', permission.function, type, event.checked);
  }

  onCreateNewRole(): void {
    console.log('Create new role clicked');
    // Implement navigation or dialog for creating new role
  }

  onCancel(): void {
    console.log('Cancel clicked');
    this.userForm.reset();
    this.roles.forEach(r => r.selected = false);
    this.permissions.forEach(p => {
      p.create = false;
      p.edit = false;
      p.editLabel = '';
    });
  }

  onCreateUser(): void {
    if (this.userForm.valid) {
      const selectedRoles = this.roles.filter(r => r.selected);
      
      if (selectedRoles.length === 0) {
        console.warn('Please select at least one role');
        return;
      }

      const userData = {
        ...this.userForm.value,
        roles: selectedRoles,
        permissions: this.permissions
      };

      console.log('Creating user:', userData);
      // Implement API call to create user
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
      console.warn('Form is invalid');
    }
  }


 onAddNewRole(): void {
    this.router.navigate(['/uam/role-details']);
  }


}