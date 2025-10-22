import { Component, inject, Pipe, signal } from '@angular/core';
import { Subscription } from 'rxjs';
//import { lastValueFrom } from 'rxjs/operators';

import { HomeService } from '../../../../home.service';
import { MatCardModule } from '@angular/material/card';
import { AlertMessage } from '../../../../layout/alert/alert-message';
import { AlertComponent } from '../../../../layout/alert/alert.component';
import { SideNavService } from '../../../../layout/sidenav/sidenav.service';
import { MatButtonModule } from '@angular/material/button';

import { QcService } from '../qc.service';
import { ICheckInfo, ISSEvent, IWeightEvent } from '../qc.model';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerComponent } from '../../../../layout/mat-progress-spinner/mat-progress-spinner.component';
import { ConfirmationDialogInterface } from '../../../../layout/confirmation-dialog/confirmation.model';
import { ConfirmationDialogComponent } from '../../../../layout/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-qc-check',
  standalone: true,
  imports: [MatCardModule, AlertComponent, MatButtonModule, MatProgressSpinnerComponent],
  templateUrl: './qc-check.component.html',
  styleUrl: './qc-check.component.scss',
})
export class QcCheckComponent {
  private subscription: Subscription | undefined;
  dialog = inject(MatDialog);
  homeService = inject(HomeService);
  qcService = inject(QcService);
  sideNavService = inject(SideNavService);
  checkInProgress = signal<boolean>(false);
  readyForCheck = true;
  alert = new AlertMessage();
  router = inject(Router);
  httpClient = inject(HttpClient);
  //checkMessage='Check in progress';
  checkInfo = signal<ICheckInfo>({
    index: 0,
    station: '',
    weight: 0,
    duration: 0,
    timestamp: 0,
    checkStatus: '',
  });
  showSpinner = false;
  tmrWatchdog: any;
  serverCommsLost = false;

  async canDeactivate(): Promise<boolean> {
    if (this.checkInProgress()) {
      const dialogData: ConfirmationDialogInterface = {
        title: 'Please Confirm',
        content: 'A check is in progress. Logout anyway?',
        yesButton: 'Yes',
        noButton: 'No',
        returnVal: undefined,
      };
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '450px',
        data: dialogData,
      });

      const response = await dialogRef.afterClosed().toPromise();
      if (response === 'Yes') {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  ngOnInit(): void {
    // this.alert.setLight('Waiting for check');

    this.sideNavService.close();
    this.initWeightCapture();
    this.checkInProgress.set(false);
    this.alert.setInfo('Waiting for check');
    this.readyForCheck = true;
    this.hitWatchdog();
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
    // this.trimlineService.trimline.startRefreshTimer();
  }

  initWeightCapture() {
    this.subscription = this.qcService.openEventSource('/api/scale/checkstream').subscribe({
      next: (packet: ISSEvent) => {
        if (packet.event === 'message') {
          this.newWeightEvent(packet);
        }
      },
      error: (err) => {
        //most likely error is the connection was closed on the server side
        console.log(err);
      },
    });
  }

  hitWatchdog(restored = true) {
    window.clearTimeout(this.tmrWatchdog);
    this.tmrWatchdog = setTimeout(this.watchdog.bind(this), 5000);

    if (this.serverCommsLost && restored) {
      this.serverCommsLost = false;
      this.alert.setLight('Server comms restored');
    }
  }

  watchdog() {
    //console.log('watchdog');
    this.alert.setLight('Server comms lost. Try logging out and back in');
    this.serverCommsLost = true;
  }

  newWeightEvent(packet: ISSEvent) {
    this.hitWatchdog();
    if (this.readyForCheck) {
      this.checkInfo.set(JSON.parse(packet.data));
      if (this.checkInfo().index != this.qcService.lastCheckIndex) {
        this.qcService.lastCheckIndex = this.checkInfo().index;
        if (this.checkInfo().index > 0) {
          this.alert.setLight('Check in progress');
          this.checkInProgress.set(true);
        } else if (this.checkInfo().index === 0) {
          this.alert.setInfo('Waiting for check');
        }
      }
    }
  }

  logout() {
    this.router.navigate(['/qc-login']);
  }

  async submitCheck(status: string) {
    this.readyForCheck = false;
    this.checkInfo().checkStatus = status;
    this.showSpinner = true;
    this.alert.setLight(`${status.toUpperCase()}`);
    await this.homeService.delay(1000);
    this.alert.setLight(`Saving`);
    await this.homeService.delay(500);
    try {
      const res = await this.httpClient.post('/api/scale/savecheck', this.checkInfo()).toPromise();
      this.checkInProgress.set(false);
      this.alert.setLight(`Saved`);
      await this.homeService.delay(1000);
      this.readyForCheck = true;
    } catch (err) {
      //this.showSpinner = false;
      this.alert.setError('Check submit failed');
    } finally {
      this.hitWatchdog(false);
      this.showSpinner = false;
      //  console.log('complete');
    }

    // this.httpClient
    //   .post('/api/scale/savecheck', this.checkInfo())
    //   .subscribe({
    //     next: (response) => {
    //       this.checkInProgress.set(false);
    //       this.alert.setLight(`Saved`);
    //       (async () => {
    //         await this.homeService.delay(1000);
    //         this.readyForCheck = true;
    //       })();
    //     },
    //     error: (err) => {
    //       this.showSpinner = false;
    //       this.alert.setError('Check submit failed');
    //     },
    //     complete: () => {
    //       this.showSpinner = false;
    //       console.log('complete');
    //     },
    //   });
  }
}
