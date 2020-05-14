import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLastRequisitionsComponent } from './dashboard-last-requisitions.component';

describe('LastRequisitionsComponent', () => {
  let component: DashboardLastRequisitionsComponent;
  let fixture: ComponentFixture<DashboardLastRequisitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardLastRequisitionsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLastRequisitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
