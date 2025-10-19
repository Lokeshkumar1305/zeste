import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OPSMenu } from '../../shared/en-common-table/en-common-table.component';
import { ApiService } from '../../common-library/services/api.service';
import { HttpClient } from '@angular/common/http';
import { roelDetails } from '../../common-library/model';

interface Permission {
  id: string;
  label: string;
}
interface Resource {
  key: string;
  title: string;
  permissions: Permission[];
}
interface FeatureModule {
  key: string;
  title: string;
  defaultExpanded?: boolean;
  resources: Resource[];
}

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss']
})
export class RoleDetailsComponent implements OnInit {
  breadCrumb: OPSMenu[] = [];
  form!: FormGroup;
  submitted = false;

  permissionsSelection = new Set<string>();

  modules: FeatureModule[] = [
    {
      key: 'user_mgmt',
      title: 'User Management',
      defaultExpanded: true,
      resources: [
        {
          key: 'role',
          title: 'Role',
          permissions: [
            { id: 'CREATE_ROLE', label: 'Create' },
            { id: 'UPDATE_ROLE', label: 'Update' },
            { id: 'VIEW_ROLE',   label: 'View' },
            { id: 'DELETE_ROLE', label: 'Delete' }
          ]
        }
      ]
    },
    {
      key: 'resident_mgmt',
      title: 'Resident Management',
      resources: [
        {
          key: 'resident_role',
          title: 'Role',
          permissions: [
            { id: 'CREATE_RESIDENT_ROLE', label: 'Create' },
            { id: 'UPDATE_RESIDENT_ROLE', label: 'Update' },
            { id: 'VIEW_RESIDENT_ROLE',   label: 'View' },
            { id: 'DELETE_RESIDENT_ROLE', label: 'Delete' }
          ]
        }
      ]
    },
    {
      key: 'community_core_mgmt',
      title: 'Community Core Management',
      resources: [
        {
          key: 'community_role',
          title: 'Role',
          permissions: [
            { id: 'CREATE_COMMUNITY_ROLE', label: 'Create' },
            { id: 'UPDATE_COMMUNITY_ROLE', label: 'Update' },
            { id: 'VIEW_COMMUNITY_ROLE',   label: 'View' },
            { id: 'DELETE_COMMUNITY_ROLE', label: 'Delete' }
          ]
        }
      ]
    }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private postService: ApiService,
    public http: HttpClient
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      roleTitle: ['', [Validators.required, Validators.maxLength(60)]],
      roleDescription: ['', [Validators.required, Validators.maxLength(160)]]
    });

    // Breadcrumbs: IAM / Roles / Create New Role
    this.breadCrumb = [
      { name: 'IAM', link: '/uam/dashboard' } as any,
      { name: 'Roles', link: '/uam/roles' } as any,
      { name: 'Create New Role' } as any
    ];

    // Example: match screenshot default selection
    this.permissionsSelection.add('UPDATE_ROLE');
    this.permissionsSelection.add('VIEW_ROLE');
  }

  // Accessors
  get f() {
    return this.form.controls;
  }

  // Selection
  isSelected(id: string): boolean {
    return this.permissionsSelection.has(id);
  }
  onPermissionChange(id: string, checked: boolean): void {
    if (checked) this.permissionsSelection.add(id);
    else this.permissionsSelection.delete(id);
  }

  // Actions
  onSave(): void {
    this.submitted = true;
    if (this.form.invalid || this.permissionsSelection.size === 0) return;

    const payload: roelDetails = {
      ...new (class implements roelDetails {
        roleTitle!: string;
        roleDescription!: string;
        privilegeId!: string[];
      })(),
      roleTitle: this.form.value.roleTitle?.trim(),
      roleDescription: this.form.value.roleDescription?.trim(),
      privilegeId: Array.from(this.permissionsSelection)
    };

    console.log('Create Role payload:', payload);
    // TODO: call API and navigate
  }

  onCancel(): void {
    this.router.navigate(['/uam/roles']);
  }

  // trackBys
  trackByModule = (_: number, item: FeatureModule) => item.key;
  trackByResource = (_: number, item: Resource) => item.key;
  trackByPermission = (_: number, item: Permission) => item.id;
  trackByCrumb = (_: number, item: OPSMenu) => (item as any)?.name;
}