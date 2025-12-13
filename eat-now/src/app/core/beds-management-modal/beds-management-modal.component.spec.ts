import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedsManagementModalComponent } from './beds-management-modal.component';

describe('BedsManagementModalComponent', () => {
  let component: BedsManagementModalComponent;
  let fixture: ComponentFixture<BedsManagementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BedsManagementModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BedsManagementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
