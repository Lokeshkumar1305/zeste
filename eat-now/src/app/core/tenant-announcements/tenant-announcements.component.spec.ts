import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantAnnouncementsComponent } from './tenant-announcements.component';

describe('TenantAnnouncementsComponent', () => {
  let component: TenantAnnouncementsComponent;
  let fixture: ComponentFixture<TenantAnnouncementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantAnnouncementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TenantAnnouncementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
