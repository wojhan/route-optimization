import { TestBed, async, inject } from '@angular/core/testing';

import { IsStaffGuard } from './is-staff.guard';

describe('IsStaffGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsStaffGuard]
    });
  });

  it('should ...', inject([IsStaffGuard], (guard: IsStaffGuard) => {
    expect(guard).toBeTruthy();
  }));
});
