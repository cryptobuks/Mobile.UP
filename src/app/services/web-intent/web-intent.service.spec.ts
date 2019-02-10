import { TestBed } from '@angular/core/testing';

import { WebIntentService } from './web-intent.service';

describe('WebIntentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebIntentService = TestBed.get(WebIntentService);
    expect(service).toBeTruthy();
  });
});
