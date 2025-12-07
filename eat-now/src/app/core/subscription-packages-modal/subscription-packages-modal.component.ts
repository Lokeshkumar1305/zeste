import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  PackageModule,
  SubscriptionPackage,
  PlanType,
} from '../subscription-packages/subscription-packages.component';

export interface SubscriptionPackagesModalData {
  mode: 'create' | 'edit';
  value?: SubscriptionPackage;
}

@Component({
  selector: 'app-subscription-packages-modal',
  templateUrl: './subscription-packages-modal.component.html',
  styleUrls: ['./subscription-packages-modal.component.scss'],
})
export class SubscriptionPackagesModalComponent implements OnInit {
  form!: FormGroup;
  mode: 'create' | 'edit' = 'create';
  private pkgToEdit?: SubscriptionPackage;

  constructor(private fb: FormBuilder, private router: Router) {
    // Read data from router navigation state (set in list component)
    const nav = this.router.getCurrentNavigation();
    const state = (nav?.extras?.state || {}) as SubscriptionPackagesModalData;

    if (state.mode) this.mode = state.mode;
    if (state.value) this.pkgToEdit = state.value;
  }

  ngOnInit(): void {
    const pkg = this.pkgToEdit;

    this.form = this.fb.group({
      id: [pkg?.id ?? 0],
      name: [pkg?.name ?? '', Validators.required],
      description: [pkg?.description ?? ''],
      planType: [pkg?.planType ?? ('paid' as PlanType), Validators.required],
      packageType: [pkg?.packageType ?? 'standard', Validators.required],
      currency: [pkg?.currency ?? 'INR', Validators.required],
      monthlyPrice: [pkg?.monthlyPrice ?? null],
      annualPrice: [pkg?.annualPrice ?? null],
      lifetimePrice: [pkg?.lifetimePrice ?? null],
      trialDays: [pkg?.trialDays ?? null],
      recommended: [pkg?.recommended ?? false],
      isPrivate: [pkg?.isPrivate ?? false],
      isActive: [pkg?.isActive ?? true],
      isDefault: [pkg?.isDefault ?? false],
      modules: this.fb.array(
        (pkg?.modules ?? this.getDefaultModules()).map((m) =>
          this.fb.group({
            key: [m.key],
            label: [m.label],
            included: [m.included],
          })
        )
      ),
    });

    this.updatePriceFieldState(this.form.get('planType')!.value);
    this.form.get('planType')!.valueChanges.subscribe((val) =>
      this.updatePriceFieldState(val)
    );
  }

  get modulesArray(): FormArray {
    return this.form.get('modules') as FormArray;
  }

  private updatePriceFieldState(planType: PlanType): void {
    const priceControls = ['monthlyPrice', 'annualPrice', 'lifetimePrice'];
    if (planType === 'free') {
      priceControls.forEach((c) =>
        this.form.get(c)!.disable({ emitEvent: false })
      );
    } else {
      priceControls.forEach((c) =>
        this.form.get(c)!.enable({ emitEvent: false })
      );
    }
  }

  private getDefaultModules(): PackageModule[] {
    return [
      { key: 'hostel', label: 'Hostel Management', included: true },
      { key: 'rooms', label: 'Room & Bed Allocation', included: true },
      { key: 'fees', label: 'Fees & Invoicing', included: true },
      { key: 'online-pay', label: 'Online Payments', included: false },
      { key: 'visitors', label: 'Visitor Log', included: false },
      { key: 'maintenance', label: 'Maintenance Tickets', included: false },
      { key: 'inventory', label: 'Inventory', included: false },
      { key: 'mess', label: 'Mess / Canteen', included: false },
      { key: 'reports', label: 'Reports & Analytics', included: true },
      { key: 'integrations', label: 'Payment / SMS Integrations', included: false },
    ];
  }

  toggleAllModules(value: boolean): void {
    this.modulesArray.controls.forEach((ctrl) =>
      ctrl.get('included')!.setValue(value)
    );
  }

  goBack(): void {
    this.router.navigate(['/core/subscription-packages']);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.getRawValue() as SubscriptionPackage;

    // TODO: call your API here (create or update), then navigate back.
    console.log('Saving package:', data);

    this.router.navigate(['/core/subscription-packages'], {
      state: { savedPackage: data, mode: this.mode },
    });
  }
}