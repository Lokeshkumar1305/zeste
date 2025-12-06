import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPackagesModalComponent } from './subscription-packages-modal.component';

describe('SubscriptionPackagesModalComponent', () => {
  let component: SubscriptionPackagesModalComponent;
  let fixture: ComponentFixture<SubscriptionPackagesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionPackagesModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubscriptionPackagesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
