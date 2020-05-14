import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyEditPage } from './company-edit.page';

describe('CompanyEditComponent', () => {
  let component: CompanyEditPage;
  let fixture: ComponentFixture<CompanyEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyEditPage]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
