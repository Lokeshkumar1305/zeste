import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryItemsCategoriesModalComponent } from './inventory-items-categories-modal.component';

describe('InventoryItemsCategoriesModalComponent', () => {
  let component: InventoryItemsCategoriesModalComponent;
  let fixture: ComponentFixture<InventoryItemsCategoriesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryItemsCategoriesModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryItemsCategoriesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
