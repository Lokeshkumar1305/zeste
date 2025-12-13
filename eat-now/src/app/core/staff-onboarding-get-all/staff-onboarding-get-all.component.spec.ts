import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffOnboardingGetAllComponent } from './staff-onboarding-get-all.component';

describe('StaffOnboardingGetAllComponent', () => {
  let component: StaffOnboardingGetAllComponent;
  let fixture: ComponentFixture<StaffOnboardingGetAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaffOnboardingGetAllComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaffOnboardingGetAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
