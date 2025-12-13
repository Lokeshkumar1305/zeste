import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorsManagementModalComponent } from './floors-management-modal.component';

describe('FloorsManagementModalComponent', () => {
  let component: FloorsManagementModalComponent;
  let fixture: ComponentFixture<FloorsManagementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FloorsManagementModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FloorsManagementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
