import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomManagementModalComponent } from './room-management-modal.component';

describe('RoomManagementModalComponent', () => {
  let component: RoomManagementModalComponent;
  let fixture: ComponentFixture<RoomManagementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoomManagementModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomManagementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
