import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionBillingHistoryComponent } from './subscription-billing-history.component';

describe('SubscriptionBillingHistoryComponent', () => {
  let component: SubscriptionBillingHistoryComponent;
  let fixture: ComponentFixture<SubscriptionBillingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionBillingHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubscriptionBillingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
