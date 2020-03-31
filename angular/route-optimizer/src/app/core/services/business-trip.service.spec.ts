import { TestBed } from '@angular/core/testing';

import { BusinessTripService } from './business-trip.service';

describe('BusinessTripService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BusinessTripService = TestBed.get(BusinessTripService);
    expect(service).toBeTruthy();
  });
});
