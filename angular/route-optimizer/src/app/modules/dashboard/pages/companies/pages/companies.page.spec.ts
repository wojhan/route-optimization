import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesPage } from './companies.page';

describe('CompaniesComponent', () => {
  let component: CompaniesPage;
  let fixture: ComponentFixture<CompaniesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompaniesPage]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
