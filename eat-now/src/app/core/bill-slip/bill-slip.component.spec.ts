import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillSlipComponent } from './bill-slip.component';

describe('BillSlipComponent', () => {
  let component: BillSlipComponent;
  let fixture: ComponentFixture<BillSlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillSlipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
