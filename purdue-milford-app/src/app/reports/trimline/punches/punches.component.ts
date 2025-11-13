import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerComponent } from '../../../layout/mat-progress-spinner/mat-progress-spinner.component';

import { HomeService, IUnixStartStop } from '../../../home.service';
import { MatSelectModule } from '@angular/material/select';
import { IPunch, IPunchesResponse, StationsService } from '../stations/stations.service';
import { AuthService } from '../../../users/login/auth.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSortCacheDirective } from '../../../mat-sort-cache.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PunchesDialogComponent } from './punches-dialog.component';
import { IShift } from '../../../serverMap';
import { ConfirmationDialogInterface } from '../../../layout/confirmation-dialog/confirmation.model';
import { ConfirmationDialogComponent } from '../../../layout/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-punches',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatNativeDateModule,
    MatProgressSpinnerComponent,
    MatSelectModule,
    MatSortModule,
    MatSortCacheDirective,
    MatIconModule,
  ],
  templateUrl: './punches.component.html',
  styleUrls: ['./punches.component.scss', '../../../../styles/table.scss'],
})
export class PunchesComponent implements OnInit, AfterViewInit {
  fb = inject(FormBuilder);
  httpClient = inject(HttpClient);
  homeService = inject(HomeService);
  stationService = inject(StationsService);
  authService = inject(AuthService);
  dialog = inject(MatDialog);
  loading = false;
  lastId = 0;

  displayedColumns: string[] = ['id', 'station', 'cutter_number', 'name', 'punchIn', 'punchOut', 'actions'];
  frmGrp = this.fb.group({
    dateControl: [new Date(), Validators.required],
    shiftControl: [1, Validators.required],
  });

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  async ngOnInit() {
    this.loading = true;
    await this.stationService.loadStations();
    const date = this.frmGrp.controls.dateControl.value ?? new Date();
    const shift = this.frmGrp.controls.shiftControl.value ?? 0;
    await this.stationService.loadPunches(date, shift);
    this.loading = false;
  }

  ngAfterViewInit(): void {
    this.stationService.datasourcePunches.sort = this.sort;
  }

  formatTime(timestamp: number | null): string {
    if (!timestamp) return '-';
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  calculateHours(punchIn: number, punchOut: number | null): string {
    if (!punchOut) return '-';
    const hours = (punchOut - punchIn) / 3600;
    return hours.toFixed(2);
  }

  async applyFilter() {
    const date = this.frmGrp.controls.dateControl.value ?? new Date();
    const shift = this.frmGrp.controls.shiftControl.value ?? 0;
    await this.stationService.loadPunches(date, shift);
  }

  async onCreateTimesheet() {
    if (this.stationService.datasourcePunches.data.length > 0) {
      const dialogData: ConfirmationDialogInterface = {
        title: 'Warning',
        content: 'Existing punches will be overwritten. Continue?',
        yesButton: 'OK',
        noButton: '',
        cancelButton: 'Cancel',
        returnVal: undefined,
        width: '450px',
      };
      const action = await this.homeService.showDialogMessage(dialogData);
      if (action === 'OK') {
        this.stationService.datasourcePunches.data = [];
      } else {
        return;
      }
    }

    const selectedDate = this.frmGrp.controls.dateControl.value;
    const shift = this.homeService.serverMap.appConfig.shifts.find((s) => s.number === this.frmGrp.controls.shiftControl.value);
    if (selectedDate === null || shift === undefined) return;
    this.createTimesheet(selectedDate, shift);
  }

  async createTimesheet(date: Date, shift: IShift): Promise<IPunch[]> {
    this.lastId = 0;
    const productionDate = this.homeService.getUnixTimestampDateOnly(date);
    const punches: IPunch[] = [];
    const shiftTime = this.homeService.serverMap.getUnixStartStopFromIShift(date, shift);
    this.stationService.datasource.data
      .filter((e) => e.shift == shift.number)
      .forEach((s) => {
        punches.push({
          id: ++this.lastId,
          productionDate: productionDate,
          shift: shift.number,
          cutter_number: s.cutter_number,
          name: s.name,
          station: s.station,
          punchIn: s.cutter_number > 0 ? shiftTime.startUnix : 0,
          punchOut: s.cutter_number > 0 ? shiftTime.stopUnix : 0,
          updateBy: this.authService.loadedUser?.username || 'system',
          //updateAt: this.homeService.getUnixTimestampDateOnly(new Date()),
        });
      });

    // Save to backend
    this.httpClient.post<IPunchesResponse>(`/api/punches/save/${productionDate}/${shift.number}`, { punches }).subscribe({
      next: () => {
        this.stationService.datasourcePunches.data = [...punches];
        console.log('Punch saved successfully');
      },
      error: (error: any) => {
        console.error('Error saving punch:', error);
        this.homeService.showAlert('Error', 'Failed to save timesheet. server unreachable.');
      },
    });

    //console.log(punches);
    return punches;
  }

  onEditPunch(punch: IPunch) {
    const punchCopy = this.homeService.copyObject(punch) as IPunch;
    const shift = this.homeService.serverMap.appConfig.shifts.find((s) => s.number === this.frmGrp.controls.shiftControl.value);
    if (shift === undefined) return;
    this.editPunch(punchCopy, shift);
  }

  onAddPunch() {
    const selectedDate = this.frmGrp.controls.dateControl.value;
    const shift = this.homeService.serverMap.appConfig.shifts.find((s) => s.number === this.frmGrp.controls.shiftControl.value);
    if (selectedDate === null || shift === undefined) return;
    const newPunch: IPunch = {
      id: ++this.lastId,
      productionDate: this.homeService.getUnixTimestampDateOnly(selectedDate),
      shift: shift.name === 'Day' ? 1 : 2,
      cutter_number: 0,
      name: '',
      station: '',
      punchIn: 0,
      punchOut: 0,
      updateBy: this.authService.loadedUser?.username || 'system',
    };

    this.editPunch(newPunch, shift, 'add');
  }

  editPunch(punch: IPunch, shift: IShift, action: 'edit' | 'add' = 'edit') {
    const shiftTime = this.homeService.serverMap.getUnixStartStopFromIShift(this.homeService.getDateFromUnixTimestamp(punch.productionDate), shift);

    if (punch.punchIn === 0) {
      punch.punchIn = shiftTime.startUnix;
    }
    if (punch.punchOut === 0) {
      punch.punchOut = shiftTime.stopUnix;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '520px';
    dialogConfig.data = { punch, shift, action, shiftTime };
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(PunchesDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: IPunch) => {
      if (result) {
        // Update the punch in the datasource
        const data = this.stationService.datasourcePunches.data;
        if (action === 'add') {
          const index = data.findIndex((p: IPunch) => p.station === result.station && p.shift === result.shift && p.cutter_number === 0);
          if (index !== -1) {
            data[index] = result;
            this.stationService.datasourcePunches.data = [...data];
          } else {
            data.push(result);
            this.stationService.datasourcePunches.data = [...data];
          }
        } else {
          const index = data.findIndex((p: IPunch) => p.station === result.station && p.shift === result.shift);
          if (index !== -1) {
            data[index] = result;
            this.stationService.datasourcePunches.data = [...data];
          }
        }
        // Save to backend
        const punches = this.stationService.datasourcePunches.data;

        this.httpClient.post<IPunchesResponse>(`/api/punches/save/${punch.productionDate}/${shift.number}`, { punches }).subscribe({
          next: () => {
            console.log('Timesheet saved successfully');
          },
          error: (error: any) => {
            console.error('Error saving punch:', error);
            this.homeService.showAlert('Error', 'Failed to save timesheet. server unreachable.');
          },
        });
      }
    });
  }

  onDeletePunch(punch: IPunch) {
    const dialogData: ConfirmationDialogInterface = {
      title: 'Please Confirm',
      content: `Are you sure you want to delete the punch for station ${punch.station}?`,
      yesButton: 'Delete',
      cancelButton: 'Cancel',
      returnVal: undefined,
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((action: string) => {
      if (action === 'Delete') {
        const data = this.stationService.datasourcePunches.data;
        const count = data.filter((p: IPunch) => p.station === punch.station).length;
        const index = data.findIndex((p: IPunch) => p.id === punch.id);

        if (index !== -1) {
          //if multiple punches exist for the station, delete the punch, else clear the punch info
          if (count > 1) {
            data.splice(index, 1);
            //this.stationService.datasourcePunches.data = [...data];
          } else {
            data.map((p: IPunch) => {
              if (p.id === punch.id) {
                return { ...p, cutter_number: 0, name: '', punchIn: 0, punchOut: 0 };
              }
              return p;
            });
          }
          this.httpClient.post<IPunchesResponse>(`/api/punches/save/${punch.productionDate}/${punch.shift}`, { punches: data }).subscribe({
            next: () => {
              this.stationService.datasourcePunches.data = [...data];
              console.log('Punch deleted successfully');
            },
            error: (error: any) => {
              this.homeService.showAlert('Error', 'Failed to delete punch. server unreachable.');
              console.error('Error deleting punch:', error);
            },
          });
        }
      }
    });
  }

  onDeleteTimesheet() {
    const frm = this.frmGrp.value;
    const dialogData: ConfirmationDialogInterface = {
      title: 'Please Confirm',
      content: 'Are you sure you want to delete all punches for the selected date and shift?',
      yesButton: 'Delete',
      cancelButton: 'Cancel',
      returnVal: undefined,
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((action: string) => {
      if (action === 'Delete') {
        const data = this.stationService.datasourcePunches.data;
        if (this.frmGrp.invalid) {
          this.homeService.showAlert('Warning', 'Invalid date or shift selection.');
          return;
        }
        const productionDate = this.homeService.getUnixTimestampDateOnly(frm.dateControl ?? new Date());
        const shiftControlValue = this.frmGrp.get('shiftControl')?.value ?? 0;

        // Filter out punches for the selected date and shift
        const filteredData = data.filter((p: IPunch) => {
          return !(p.productionDate === productionDate && p.shift === shiftControlValue);
        });

        // Save to backend
        this.httpClient.post<IPunchesResponse>(`/api/punches/save/${productionDate}/${shiftControlValue}`, { punches: filteredData }).subscribe({
          next: () => {
            this.stationService.datasourcePunches.data = filteredData;
            console.log('Timesheet deleted successfully');
          },
          error: (error: any) => {
            console.error('Error deleting timesheet:', error);
          },
        });
      }
    });
  }
}
