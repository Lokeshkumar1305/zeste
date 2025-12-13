import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmenitiesManagementComponent } from './amenities-management.component';

describe('AmenitiesManagementComponent', () => {
  let component: AmenitiesManagementComponent;
  let fixture: ComponentFixture<AmenitiesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AmenitiesManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AmenitiesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
