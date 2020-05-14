import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseLayoutNavbarComponent } from './base-layout-navbar.component';

describe('BaseLayoutNavbarComponent', () => {
  let component: BaseLayoutNavbarComponent;
  let fixture: ComponentFixture<BaseLayoutNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaseLayoutNavbarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLayoutNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
