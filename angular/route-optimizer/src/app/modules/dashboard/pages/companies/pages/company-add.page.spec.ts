import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAddPage } from './company-add.page';

describe('CompanyAddComponent', () => {
  let component: CompanyAddPage;
  let fixture: ComponentFixture<CompanyAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyAddPage]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
