import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmenitiesManagementModalComponent } from './amenities-management-modal.component';

describe('AmenitiesManagementModalComponent', () => {
  let component: AmenitiesManagementModalComponent;
  let fixture: ComponentFixture<AmenitiesManagementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AmenitiesManagementModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AmenitiesManagementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
