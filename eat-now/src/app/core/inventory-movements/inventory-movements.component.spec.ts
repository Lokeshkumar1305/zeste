import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryMovementsComponent } from './inventory-movements.component';

describe('InventoryMovementsComponent', () => {
  let component: InventoryMovementsComponent;
  let fixture: ComponentFixture<InventoryMovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryMovementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
