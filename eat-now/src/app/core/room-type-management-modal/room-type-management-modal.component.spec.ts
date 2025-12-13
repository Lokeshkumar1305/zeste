import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomTypeManagementModalComponent } from './room-type-management-modal.component';

describe('RoomTypeManagementModalComponent', () => {
  let component: RoomTypeManagementModalComponent;
  let fixture: ComponentFixture<RoomTypeManagementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoomTypeManagementModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomTypeManagementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
