import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedsManagementComponent } from './beds-management.component';

describe('BedsManagementComponent', () => {
  let component: BedsManagementComponent;
  let fixture: ComponentFixture<BedsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BedsManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BedsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
