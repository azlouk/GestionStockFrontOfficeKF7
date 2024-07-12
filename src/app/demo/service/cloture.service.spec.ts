import { TestBed } from '@angular/core/testing';

import { ClotureService } from './cloture.service';

describe('ClotureService', () => {
  let service: ClotureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClotureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
