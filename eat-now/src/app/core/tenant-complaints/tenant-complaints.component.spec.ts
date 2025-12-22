import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantComplaintsComponent } from './tenant-complaints.component';

describe('TenantComplaintsComponent', () => {
  let component: TenantComplaintsComponent;
  let fixture: ComponentFixture<TenantComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantComplaintsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TenantComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
