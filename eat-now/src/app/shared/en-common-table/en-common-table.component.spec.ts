import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnCommonTableComponent } from './en-common-table.component';

describe('EnCommonTableComponent', () => {
  let component: EnCommonTableComponent;
  let fixture: ComponentFixture<EnCommonTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnCommonTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnCommonTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
