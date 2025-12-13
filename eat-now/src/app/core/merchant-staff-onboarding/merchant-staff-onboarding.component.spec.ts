import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantStaffOnboardingComponent } from './merchant-staff-onboarding.component';

describe('MerchantStaffOnboardingComponent', () => {
  let component: MerchantStaffOnboardingComponent;
  let fixture: ComponentFixture<MerchantStaffOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MerchantStaffOnboardingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MerchantStaffOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
