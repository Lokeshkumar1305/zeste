import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryUnitsComponent } from './inventory-units.component';

describe('InventoryUnitsComponent', () => {
  let component: InventoryUnitsComponent;
  let fixture: ComponentFixture<InventoryUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryUnitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
