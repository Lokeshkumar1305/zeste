import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryPurchaseOrdersModalComponent } from './inventory-purchase-orders-modal.component';

describe('InventoryPurchaseOrdersModalComponent', () => {
  let component: InventoryPurchaseOrdersModalComponent;
  let fixture: ComponentFixture<InventoryPurchaseOrdersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryPurchaseOrdersModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryPurchaseOrdersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
