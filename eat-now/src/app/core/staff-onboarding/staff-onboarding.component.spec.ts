import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffOnboardingComponent } from './staff-onboarding.component';

describe('StaffOnboardingComponent', () => {
  let component: StaffOnboardingComponent;
  let fixture: ComponentFixture<StaffOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaffOnboardingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaffOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
