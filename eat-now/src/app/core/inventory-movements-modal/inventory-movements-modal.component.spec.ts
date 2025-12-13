import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryMovementsModalComponent } from './inventory-movements-modal.component';

describe('InventoryMovementsModalComponent', () => {
  let component: InventoryMovementsModalComponent;
  let fixture: ComponentFixture<InventoryMovementsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryMovementsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryMovementsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
