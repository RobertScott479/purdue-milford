import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AlertComponent } from '../../../../layout/alert/alert.component';
import { MatButtonModule } from '@angular/material/button';
import { QcService } from '../qc.service';
import { SideNavService } from '../../../../layout/sidenav/sidenav.service';
import { AlertMessage } from '../../../../layout/alert/alert-message';
import { Router } from '@angular/router';
import { MatProgressSpinnerComponent } from '../../../../layout/mat-progress-spinner/mat-progress-spinner.component';
import { HomeService } from '../../../../home.service';
import { TrimlineService } from '../../datasource/trimline.service';

@Component({
  selector: 'app-qc-login',
  standalone: true,
  imports: [MatCardModule, AlertComponent, MatButtonModule],
  templateUrl: './qc-login.component.html',
  styleUrl: './qc-login.component.scss',
})
export class QcLoginComponent {
  qcService = inject(QcService);
  sideNavService = inject(SideNavService);
  checkInProgress = false;
  alert = new AlertMessage();
  router = inject(Router);
  trimlineService = inject(TrimlineService);

  ngOnInit(): void {
    this.trimlineService.trimline.stopRefreshTimer();
    this.alert.setLight('You are logged out. Press Login to begin');
    this.sideNavService.close();
  }

  qclogin() {
    this.router.navigate(['/qc-check']);
  }
}
