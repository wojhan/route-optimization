import { TestBed } from '@angular/core/testing';

import { MyBusinessTripsService } from './my-business-trips.service';

describe('MyBusinessTripsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyBusinessTripsService = TestBed.get(MyBusinessTripsService);
    expect(service).toBeTruthy();
  });
});
