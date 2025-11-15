import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

import { Subscription, timer } from 'rxjs';

import { HomeService } from '../../../home.service';
import { ConfirmationDialogInterface } from '../../../layout/confirmation-dialog/confirmation.model';
import { ConfirmationDialogComponent } from '../../../layout/confirmation-dialog/confirmation-dialog.component';
import { StationInterface, StationsService } from './stations.service';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AlertComponent } from '../../../layout/alert/alert.component';
import { MatProgressSpinnerComponent } from '../../../layout/mat-progress-spinner/mat-progress-spinner.component';
import { MatTab } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ServerStatusIndicatorsComponent } from '../../../layout/server-status-indicators/server-status-indicators.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ServerMapInterface } from '../../../serverMap';
import { TrimlineService } from '../datasource/trimline.service';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.scss', '../../../../styles/table.scss'],
  imports: [
    CommonModule,
    MatSort,
    MatCardModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    AlertComponent,
    FormsModule,
    MatProgressSpinnerComponent,
    MatTableModule,
    MatIconModule,
    ServerStatusIndicatorsComponent,
    MatButtonModule,
    MatSlideToggleModule,
  ],
})
export class StationComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @Input() ServerChanged = '';

  displayedColumns = ['station', 'enabled'];
  enabledString = ['Off', 'On'];

  //slideToggleColor: ThemePalette = 'primary';

  //isDirty = false;
  showSpinner = signal(false);

  //frmGroup: any;

  serverList: ServerMapInterface[] = [];

  constructor(
    public dialog: MatDialog,
    public homeService: HomeService,
    public stationService: StationsService,
    public trimlineService: TrimlineService
  ) {
    // this.frmGroup = this.fb.group({
    //   server: [1, Validators.required],
    // });
  }

  async onServerChange() {
    const canDeactivate = await this.canDeactivate();
    if (canDeactivate) {
      //const server = this.serverList.find((s) => s.index === this.frmGroup.controls['server'].value);
      await this.loadStationsAsync();
    }
  }

  async canDeactivate(): Promise<boolean> {
    if (this.stationService.dirty) {
      const dialogData: ConfirmationDialogInterface = {
        title: 'Please Confirm',
        content: 'You have unsaved changes. Continue anyway?',
        yesButton: 'Yes',
        noButton: 'No',
        returnVal: '',
      };
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '450px',
        data: dialogData,
      });

      const response = await dialogRef.afterClosed().toPromise();
      if (response === 'No') {
        return false;
      } else {
        this.onCancel();
        return true;
      }
    }
    return true;
  }

  async ngOnInit() {
    await this.homeService.serverMap.loadServerMap('production');
    this.serverList = this.homeService.serverMap.getServersByGroup(['trimline']);
    this.showSpinner.set(true);
    await this.loadStationsAsync();
    this.showSpinner.set(false);
  }

  ngAfterViewInit(): void {
    this.stationService.datasourceStations.sort = this.sort;
  }

  onChange(station: string) {
    this.stationService.dirty = true;
    const row = this.stationService.datasourceStations.data.find((s) => s.station === station);
    if (row) {
      row.enabled = !row.enabled;
    }

    this.stationService.alert.setWarning('Station state has changed.  Remember to Save changes.');
  }

  async loadStationsAsync(): Promise<boolean> {
    this.stationService.alert.setInfo('Loading stations...');
    try {
      await this.stationService.loadStations();

      return true;
    } catch (err) {
      this.stationService.alert.setError('Unable to load stations. ' + this.stationService.alert.getErrorMessage(err));
      return false;
    }
  }

  // async onSaveStations() {
  //   this.stationService.alert.clear();
  //   const temp: StationInterface[] = [];
  //   temp.push(...this.oddStations);
  //   temp.push(...this.evenStations);
  //   if (temp.length === 0) return;
  //   try {
  //     this.showSpinner.set(true);
  //     const stations = { stations: temp };
  //     const res = await this.stationService.saveStations(stations.stations);
  //     if (res.errorCode === '0') {
  //       this.showSpinner.set(false);
  //       this.isDirty = false;
  //       this.homeService.disableServerSelection = this.isDirty;
  //       this.stationService.alert.setInfo('Changes saved.');
  //       window.scrollTo(0, 0);
  //     } else {
  //       this.stationService.alert.setError(res.errorMessage);
  //       window.scrollTo(0, 0);
  //     }
  //   } catch (err) {
  //     this.stationService.alert.setError('Unable to confirm save. ' + this.stationService.alert.getErrorMessage(err));
  //   }
  // }

  async onCancel() {
    this.stationService.alert.clear();
    if (this.stationService.dirty) {
      this.showSpinner.set(true);
      const successful = await this.loadStationsAsync();
      this.showSpinner.set(false);
      if (successful) {
        this.stationService.dirty = false;
        window.scrollTo(0, 0);
        this.stationService.alert.setInfo('Changes canceled.');
      }
    } else {
      this.stationService.alert.setInfo('Nothing to cancel.');
      window.scrollTo(0, 0);
    }
  }

  onSaveStations() {
    this.stationService.onSaveStations();
    this.stationService.dirty = false;
  }
}
