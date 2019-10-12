import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private isSidebarHidden: boolean;

  constructor() {
    this.isSidebarHidden = localStorage.getItem('isSidebarHidden') === 'false' ? false : true;
    if (!this.isSidebarHidden) {
      this.isSidebarHidden = false;
    }
    console.log(this.isSidebarHidden);
  }

  setIsSidebarHidden(value: boolean): void {
    this.isSidebarHidden = value;
  }

  getIsSidebarHidden(): boolean {
    return this.isSidebarHidden;
  }
}
