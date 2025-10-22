import { Component, ChangeDetectorRef, inject, signal } from '@angular/core';

import { MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenavModule } from '@angular/material/sidenav';

import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layout/footer/footer.component';

import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { SideNavService } from './layout/sidenav/sidenav.service';

import { BreakpointObserver } from '@angular/cdk/layout';
import { HomeService } from './home.service';
import { MatSelectModule } from '@angular/material/select';
import { TopbarComponent } from './layout/topbar/topbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatSidenavModule, RouterOutlet, FooterComponent, SidenavComponent, MatSelectModule, TopbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  sideNavService = inject<SideNavService>(SideNavService);
  observer = inject(BreakpointObserver);
  cd = inject(ChangeDetectorRef);
  homeService = inject(HomeService);
  title = this.homeService.serverMap.appConfig.appTitle;

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (!this.sideNavService.sideNavMenuDisabled) {
        if (res.matches) {
          this.sideNavService.mode = 'over';
          this.sideNavService.hideOnSelect = true;
          this.sideNavService.close();
        } else {
          this.sideNavService.mode = 'side';
          this.sideNavService.hideOnSelect = false;
          this.sideNavService.open();
        }
        this.cd.detectChanges();
      }
    });
  }
}
