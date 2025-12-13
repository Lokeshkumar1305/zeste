import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySuppliersModalComponent } from './inventory-suppliers-modal.component';

describe('InventorySuppliersModalComponent', () => {
  let component: InventorySuppliersModalComponent;
  let fixture: ComponentFixture<InventorySuppliersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventorySuppliersModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventorySuppliersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
