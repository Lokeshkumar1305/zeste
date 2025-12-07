import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../common-library/services/api.service';

export type PlanType = 'paid' | 'free';

export interface PackageModule {
  key: string;
  label: string;
  included: boolean;
}

export interface SubscriptionPackage {
  id: number;
  name: string;
  description?: string;
  planType: PlanType;
  packageType: 'standard' | 'trial' | 'custom';
  currency: 'INR';
  monthlyPrice?: number | null;
  annualPrice?: number | null;
  lifetimePrice?: number | null;
  trialDays?: number | null;
  recommended: boolean;
  isPrivate: boolean;
  isActive: boolean;
  isDefault: boolean;
  modules: PackageModule[];
}

@Component({
  selector: 'app-subscription-packages',
  templateUrl: './subscription-packages.component.html',
  styleUrls: ['./subscription-packages.component.scss'],
})
export class SubscriptionPackagesComponent implements OnInit {
  searchTerm = '';

  packages: SubscriptionPackage[] = [
    {
      id: 1,
      name: 'Default',
      description: 'Base access used when no package is selected.',
      planType: 'free',
      packageType: 'standard',
      currency: 'INR',
      monthlyPrice: null,
      annualPrice: null,
      lifetimePrice: null,
      trialDays: null,
      recommended: false,
      isPrivate: false,
      isActive: true,
      isDefault: true,
      modules: [
        { key: 'hostel', label: 'Hostel Management', included: true },
        { key: 'rooms', label: 'Room & Bed Allocation', included: true },
        { key: 'fees', label: 'Fees & Invoicing', included: false },
        { key: 'online-pay', label: 'Online Payments', included: false },
        { key: 'reports', label: 'Reports & Analytics', included: true },
      ],
    },
    {
      id: 2,
      name: 'Growth',
      description: 'For growing hostels and PGs.',
      planType: 'paid',
      packageType: 'standard',
      currency: 'INR',
      monthlyPrice: 999,
      annualPrice: 9999,
      lifetimePrice: null,
      trialDays: 14,
      recommended: true,
      isPrivate: false,
      isActive: true,
      isDefault: false,
      modules: [
        { key: 'hostel', label: 'Hostel Management', included: true },
        { key: 'rooms', label: 'Room & Bed Allocation', included: true },
        { key: 'fees', label: 'Fees & Invoicing', included: true },
        { key: 'online-pay', label: 'Online Payments', included: true },
        { key: 'visitors', label: 'Visitor Log', included: true },
        { key: 'maintenance', label: 'Maintenance Tickets', included: true },
        { key: 'reports', label: 'Reports & Analytics', included: true },
      ],
    },
    {
      id: 3,
      name: 'Ultimate Access',
      description: 'Unlimited modules and premium support.',
      planType: 'paid',
      packageType: 'custom',
      currency: 'INR',
      monthlyPrice: 2499,
      annualPrice: 24999,
      lifetimePrice: 79999,
      trialDays: 30,
      recommended: false,
      isPrivate: false,
      isActive: true,
      isDefault: false,
      modules: [
        { key: 'hostel', label: 'Hostel Management', included: true },
        { key: 'rooms', label: 'Room & Bed Allocation', included: true },
        { key: 'fees', label: 'Fees & Invoicing', included: true },
        { key: 'online-pay', label: 'Online Payments', included: true },
        { key: 'visitors', label: 'Visitor Log', included: true },
        { key: 'maintenance', label: 'Maintenance Tickets', included: true },
        { key: 'inventory', label: 'Inventory', included: true },
        { key: 'mess', label: 'Mess / Canteen', included: true },
        { key: 'integrations', label: 'Payment / SMS Integrations', included: true },
        { key: 'reports', label: 'Advanced Reports', included: true },
      ],
    },
  ];

  constructor(public router: Router, private api: ApiService) {}

  ngOnInit(): void {
    // Optional: handle data when you navigate back from the edit screen
    const nav = this.router.getCurrentNavigation();
    const state = (nav?.extras?.state || {}) as {
      savedPackage?: SubscriptionPackage;
      mode?: 'create' | 'edit';
    };

    if (state.savedPackage) {
      const p = state.savedPackage;
      if (state.mode === 'edit') {
        const idx = this.packages.findIndex((x) => x.id === p.id);
        if (idx > -1) this.packages[idx] = p;
      } else if (state.mode === 'create') {
        const nextId = this.packages.length
          ? Math.max(...this.packages.map((x) => x.id)) + 1
          : 1;
        this.packages.push({ ...p, id: nextId });
      }
    }
  }

  get filteredPackages(): SubscriptionPackage[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.packages;
    return this.packages.filter(
      (p) => p.name.toLowerCase().includes(term) || String(p.id).includes(term)
    );
  }

  openCreateModal(): void {
    this.router.navigate(['/core/subscription-packages-modal'], {
      state: { mode: 'create' },
    });
  }

  openEditModal(pkg: SubscriptionPackage): void {
    this.router.navigate(['/core/subscription-packages-modal'], {
      state: { mode: 'edit', value: pkg },
    });
  }

  deletePackage(pkg: SubscriptionPackage): void {
    if (pkg.isDefault) return;
    this.packages = this.packages.filter((p) => p.id !== pkg.id);
  }

  countIncludedModules(pkg: SubscriptionPackage): number {
    return pkg.modules.filter((m) => m.included).length;
  }
}