import { TestBed } from '@angular/core/testing';

import { RequistionsService } from './requistions.service';

describe('RequistionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RequistionsService = TestBed.get(RequistionsService);
    expect(service).toBeTruthy();
  });
});
