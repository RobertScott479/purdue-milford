import { Component, OnInit, Output, EventEmitter, effect, inject } from '@angular/core';

import { MatToolbar, MatToolbarModule, MatToolbarRow } from '@angular/material/toolbar';
import { SideNavService } from '../sidenav/sidenav.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { HomeService } from '../../home.service';

const ACCOUNT_PERSON =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
})
export class TopbarComponent implements OnInit {
  sideNavService = inject(SideNavService);

  @Output() sideNavToggleEvent: EventEmitter<any> = new EventEmitter();
  constructor(public homeService: HomeService) {}

  ngOnInit(): void {
    // this.userId = this.authService.activeUserSession.user.id ?? 0;
  }

  toggleSideNav() {
    // this.sideNavToggleEvent.emit();
    this.sideNavService.sideBarToggler('');
  }
}
