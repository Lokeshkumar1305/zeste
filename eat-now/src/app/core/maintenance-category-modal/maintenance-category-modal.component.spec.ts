import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceCategoryModalComponent } from './maintenance-category-modal.component';

describe('MaintenanceCategoryModalComponent', () => {
  let component: MaintenanceCategoryModalComponent;
  let fixture: ComponentFixture<MaintenanceCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintenanceCategoryModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaintenanceCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
