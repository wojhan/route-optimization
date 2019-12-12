import { TestBed } from '@angular/core/testing';

import { BusinessTripsService } from './business-trips.service';

describe('BusinessTripsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BusinessTripsService = TestBed.get(BusinessTripsService);
    expect(service).toBeTruthy();
  });
});
