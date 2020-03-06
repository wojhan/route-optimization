import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private isSidebarHidden: boolean;

  constructor() {
    this.isSidebarHidden = localStorage.getItem('isSidebarHidden') !== 'false';
    if (!this.isSidebarHidden) {
      this.isSidebarHidden = false;
    }
  }

  setIsSidebarHidden(value: boolean): void {
    this.isSidebarHidden = value;
  }

  getIsSidebarHidden(): boolean {
    return this.isSidebarHidden;
  }
}
