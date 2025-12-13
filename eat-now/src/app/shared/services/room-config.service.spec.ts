import { TestBed } from '@angular/core/testing';

import { RoomConfigService } from './room-config.service';

describe('RoomConfigService', () => {
  let service: RoomConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
