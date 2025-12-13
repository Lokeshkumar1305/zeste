import { TestBed } from '@angular/core/testing';

import { EnTableSearchviewService } from './en-table-searchview.service';

describe('EnTableSearchviewService', () => {
  let service: EnTableSearchviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnTableSearchviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
