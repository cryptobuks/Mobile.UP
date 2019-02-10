import { TestBed } from '@angular/core/testing';

import { PulsService } from './puls.service';

describe('PulsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PulsService = TestBed.get(PulsService);
    expect(service).toBeTruthy();
  });
});
