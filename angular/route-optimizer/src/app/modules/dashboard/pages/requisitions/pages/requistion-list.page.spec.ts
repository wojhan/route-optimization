import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequistionListPage } from './requistion-list.page';

describe('RequistionListComponent', () => {
  let component: RequistionListPage;
  let fixture: ComponentFixture<RequistionListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequistionListPage]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequistionListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
