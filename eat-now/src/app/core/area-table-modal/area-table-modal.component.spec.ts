import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaTableModalComponent } from './area-table-modal.component';

describe('AreaTableModalComponent', () => {
  let component: AreaTableModalComponent;
  let fixture: ComponentFixture<AreaTableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AreaTableModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AreaTableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
