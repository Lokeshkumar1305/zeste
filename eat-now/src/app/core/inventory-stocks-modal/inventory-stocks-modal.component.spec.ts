import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryStocksModalComponent } from './inventory-stocks-modal.component';

describe('InventoryStocksModalComponent', () => {
  let component: InventoryStocksModalComponent;
  let fixture: ComponentFixture<InventoryStocksModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryStocksModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryStocksModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
