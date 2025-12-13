import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryUnitsPopupComponent } from './inventory-units-popup.component';

describe('InventoryUnitsPopupComponent', () => {
  let component: InventoryUnitsPopupComponent;
  let fixture: ComponentFixture<InventoryUnitsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryUnitsPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryUnitsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
