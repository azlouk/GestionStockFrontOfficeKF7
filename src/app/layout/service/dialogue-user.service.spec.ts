import { TestBed } from '@angular/core/testing';

import { DialogueUserService } from './dialogue-user.service';

describe('DialogueUserService', () => {
  let service: DialogueUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogueUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
