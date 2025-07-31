import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ConfirmationDialogComponent } from '../../../layout/confirmation-dialog/confirmation-dialog.component';

import { ThemePalette } from '@angular/material/core';
import { delay, timeout } from 'rxjs/operators';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AlertMessage } from '../../../layout/alert/alert-message';
import { HomeService } from '../../../home.service';
import { CommonModule } from '@angular/common';

import { ConfirmationDialogInterface } from '../../../layout/confirmation-dialog/confirmation.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AlertComponent } from '../../../layout/alert/alert.component';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerComponent } from '../../../layout/mat-progress-spinner/mat-progress-spinner.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { StationInterface } from '../datasource/trimline.model';
import { TrimlineService } from '../datasource/trimline.service';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.scss'],
  standalone: true,
  imports: [
    MatSlideToggleModule,
    CommonModule,
    MatProgressSpinnerComponent,
    MatCardModule,
    MatButtonModule,
    AlertComponent,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
})
export class StationsComponent implements OnInit {
  alert = new AlertMessage();

  // frmGroupStation = new FormGroup({
  //   station: new FormControl('', Validators.required), //{ value: 0, disabled: true }
  //   enabled: new FormControl(false)
  // });

  slideToggleColor: ThemePalette = 'primary';

  action = 'Edit';
  submitted = signal(false);
  dirty = false;
  aStations: StationInterface[] = [];
  bStations: StationInterface[] = [];
  stationsLoaded = signal(false);
  timeoutDelay = 6000;
  showSpinner = signal(false);
  // subscription = new Subscription();
  //spinnerMessage = '';
  constructor(public dialog: MatDialog, private router: Router, public homeService: HomeService, public trimlineService: TrimlineService) {}

  async canDeactivate(): Promise<boolean> {
    if (this.dirty) {
      const dialogData: ConfirmationDialogInterface = {
        title: 'Please Confirm',
        content: 'You have unsaved changes. Continue anyway?',
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

  async dialogTest() {
    const dialogData: ConfirmationDialogInterface = {
      title: 'Please Confirm',
      content: 'You have unsaved changes. Continue anyway?',
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

  ngOnInit(): void {
    if (this.trimlineService.frmGroup.get('serverIndex').value == -1) {
      this.trimlineService.frmGroup.get('serverIndex').setValue(0);
    }
    this.trimlineService.trimline.stopRefreshTimer();
    this.alert.clear();
    this.loadStations();
    // this.subscription = this.homeService.frmGroupHistory.valueChanges.subscribe((frm) => {
    //   this.loadStations();
    // });
    this.dirty = false;
  }

  ngOnDestroy() {
    // this.subscription && this.subscription.unsubscribe();
  }

  onServerChange(event: any) {
    this.loadStations();
  }

  onClear() {
    this.ngOnInit();
  }

  onChange(station: string) {
    this.trimlineService.frmGroup.get('serverIndex')?.disable();
    this.submitted.set(false);
    if (station.substr(0, 1) === 'A') {
      const row = this.aStations.find((e) => {
        return e.station === station;
      });
      if (row) {
        row.enabled = !row.enabled;
        //console.log(station, row.enabled);
      }
    } else {
      const row = this.bStations.find((e) => {
        return e.station === station;
      });
      if (row) {
        row.enabled = !row.enabled;
      }
    }
    //console.log(this.aStations);
    this.dirty = true;
  }

  onSave() {
    this.alert.clear();

    // const temp = this.homeService.stationsEnableStatus.slice();
    const temp: StationInterface[] = [];
    temp.push(...this.aStations);
    temp.push(...this.bStations);
    this.showSpinner.set(true);
    this.alert.setLight('Saving stations...');
    //this.spinnerMessage = "Attempting to save stations.";
    this.trimlineService
      .saveStations(temp)
      .pipe(timeout(this.timeoutDelay))
      .pipe(delay(1000))
      .subscribe(
        (res) => {
          if (res.errorCode === '0') {
            this.submitted.set(true);
            this.trimlineService.frmGroup.get('serverIndex')?.enable();
            (async () => {
              this.alert.setSuccess('Stations saved');
              await this.homeService.delay(500);
              this.alert.setLight('Toggle stations on/off');
            })();
            this.dirty = false;
          } else {
            this.alert.setError(res.errorMessage);
          }
        },
        (err: HttpErrorResponse) => {
          this.alert.setError(err.message);
        },
        () => {
          this.showSpinner.set(false);
        }
      );
  }

  loadStations() {
    this.alert.setLight('Loading stations...');
    this.submitted.set(false);
    this.showSpinner.set(true);
    this.stationsLoaded.set(false);
    this.trimlineService
      .loadStations()
      .pipe(timeout(this.timeoutDelay))
      .pipe(delay(300))
      .subscribe(
        (res) => {
          if (res.errorCode === '0') {
            this.submitted.set(true);
            this.trimlineService.frmGroup.get('serverIndex')?.enable();
            this.aStations = res.stations.filter((e) => e.station.substr(0, 1) === 'A');
            this.bStations = res.stations.filter((e) => e.station.substr(0, 1) === 'B');
            const state = this.aStations.length > 0 || this.bStations.length > 0;
            this.stationsLoaded.set(state);
            (async () => {
              this.alert.setSuccess('Stations loaded.');
              await this.homeService.delay(1000);
              this.alert.setLight('Toggle stations On/Off.');
            })();
          } else {
            this.aStations = [];
            this.bStations = [];
            this.alert.setError(res.errorMessage);
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.alert.setError(err.message);
        },
        () => {
          this.showSpinner.set(false);
        }
      );
  }

  onBack() {
    if (this.dirty) {
      const dialogData: ConfirmationDialogInterface = {
        title: 'Please Confirm',
        content: 'You have unsaved changes. Continue anyway?',
        returnVal: '',
        noButton: 'No',
        yesButton: 'Yes',
      };
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '450px',
        backdropClass: 'custom-dialog-backdrop-class',
        panelClass: 'custom-dialog-panel-class',
        data: dialogData,
      });

      dialogRef.afterClosed().subscribe((returnVal) => {
        if (returnVal === 'Yes') {
          this.router.navigate(['/home']);
        }
      });
    } else {
      this.router.navigate(['/home']);
    }
  }

  UpdateAll(enabled: boolean) {
    this.dirty = true;
    this.submitted.set(false);
    // const temp = this.homeService.stationsEnableStatus.slice();
    // temp.map(e => e.enabled = enabled);
    // this.homeService.stationsEnableStatus = temp;
    // console.log(enabled, this.homeService.stationsEnableStatus)

    this.aStations.map((e) => (e.enabled = enabled));
    this.bStations.map((e) => (e.enabled = enabled));
    //this.homeService.stationsEnableStatus.map(e => e.enabled = enabled)
  }
}
