import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyListPage } from './company-list.page';

describe('CompanyListComponent', () => {
  let component: CompanyListPage;
  let fixture: ComponentFixture<CompanyListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyListPage]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
