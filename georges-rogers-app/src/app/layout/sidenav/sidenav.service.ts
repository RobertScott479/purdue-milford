import { Injectable, signal } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root',
})
export class SideNavService {
  constructor() {}

  sideNavOpened = signal(true);
  sideNavMenuDisabled = false;
  hideOnSelect = false;
  mode: MatDrawerMode = 'side';

  sideBarToggler(event: any) {
    this.sideNavOpened.set(!this.sideNavOpened());
  }

  open() {
    this.sideNavOpened.set(true);
  }

  close() {
    this.sideNavOpened.set(false);
  }
}
