import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseLayoutUserSidebarComponent } from './base-layout-user-sidebar.component';

describe('BaseLayoutUserSidebarComponent', () => {
  let component: BaseLayoutUserSidebarComponent;
  let fixture: ComponentFixture<BaseLayoutUserSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaseLayoutUserSidebarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLayoutUserSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
