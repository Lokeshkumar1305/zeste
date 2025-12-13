import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryPurchaseOrdersComponent } from './inventory-purchase-orders.component';

describe('InventoryPurchaseOrdersComponent', () => {
  let component: InventoryPurchaseOrdersComponent;
  let fixture: ComponentFixture<InventoryPurchaseOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryPurchaseOrdersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryPurchaseOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
