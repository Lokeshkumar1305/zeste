import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceManagementModalComponent } from './maintenance-management-modal.component';

describe('MaintenanceManagementModalComponent', () => {
  let component: MaintenanceManagementModalComponent;
  let fixture: ComponentFixture<MaintenanceManagementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintenanceManagementModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaintenanceManagementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
