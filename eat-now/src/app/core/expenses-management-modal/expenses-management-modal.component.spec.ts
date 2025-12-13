import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesManagementModalComponent } from './expenses-management-modal.component';

describe('ExpensesManagementModalComponent', () => {
  let component: ExpensesManagementModalComponent;
  let fixture: ComponentFixture<ExpensesManagementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpensesManagementModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpensesManagementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
