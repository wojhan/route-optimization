import { TestBed } from '@angular/core/testing';

import { DashboardHomeService } from './dashboard-home.service';

describe('DashboardHomeServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardHomeService = TestBed.get(DashboardHomeService);
    expect(service).toBeTruthy();
  });
});
