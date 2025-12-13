import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesCategoryModalComponent } from './expenses-category-modal.component';

describe('ExpensesCategoryModalComponent', () => {
  let component: ExpensesCategoryModalComponent;
  let fixture: ComponentFixture<ExpensesCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpensesCategoryModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpensesCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
