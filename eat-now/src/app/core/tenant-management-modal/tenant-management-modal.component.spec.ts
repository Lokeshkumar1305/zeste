import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantManagementModalComponent } from './tenant-management-modal.component';

describe('TenantManagementModalComponent', () => {
  let component: TenantManagementModalComponent;
  let fixture: ComponentFixture<TenantManagementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantManagementModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TenantManagementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
