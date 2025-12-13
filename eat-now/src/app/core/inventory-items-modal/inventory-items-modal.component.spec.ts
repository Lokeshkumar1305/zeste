import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryItemsModalComponent } from './inventory-items-modal.component';

describe('InventoryItemsModalComponent', () => {
  let component: InventoryItemsModalComponent;
  let fixture: ComponentFixture<InventoryItemsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryItemsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryItemsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
