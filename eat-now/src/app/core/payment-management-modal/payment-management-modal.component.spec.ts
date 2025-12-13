import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentManagementModalComponent } from './payment-management-modal.component';

describe('PaymentManagementModalComponent', () => {
  let component: PaymentManagementModalComponent;
  let fixture: ComponentFixture<PaymentManagementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentManagementModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentManagementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
