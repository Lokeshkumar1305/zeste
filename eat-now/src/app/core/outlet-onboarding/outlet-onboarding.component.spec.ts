import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletOnboardingComponent } from './outlet-onboarding.component';

describe('OutletOnboardingComponent', () => {
  let component: OutletOnboardingComponent;
  let fixture: ComponentFixture<OutletOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutletOnboardingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OutletOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
