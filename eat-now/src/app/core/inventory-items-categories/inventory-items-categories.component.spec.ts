import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryItemsCategoriesComponent } from './inventory-items-categories.component';

describe('InventoryItemsCategoriesComponent', () => {
  let component: InventoryItemsCategoriesComponent;
  let fixture: ComponentFixture<InventoryItemsCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryItemsCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryItemsCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
