import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySuppliersComponent } from './inventory-suppliers.component';

describe('InventorySuppliersComponent', () => {
  let component: InventorySuppliersComponent;
  let fixture: ComponentFixture<InventorySuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventorySuppliersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventorySuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
