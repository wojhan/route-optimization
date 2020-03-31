import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationCompletePage } from './registration-complete.page';

describe('RegistrationCompleteComponent', () => {
  let component: RegistrationCompletePage;
  let fixture: ComponentFixture<RegistrationCompletePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationCompletePage]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationCompletePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
