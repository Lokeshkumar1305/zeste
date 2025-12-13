import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorsManagementComponent } from './floors-management.component';

describe('FloorsManagementComponent', () => {
  let component: FloorsManagementComponent;
  let fixture: ComponentFixture<FloorsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FloorsManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FloorsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
