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
import { firstValueFrom } from 'rxjs';
import { EmployeeService } from '../employees/employee.service';
import { AlertComponent } from '../../../layout/alert/alert.component';

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
    AlertComponent,
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
  employeeService = inject(EmployeeService);
  dialog = inject(MatDialog);
  loading = false;
  lastId = 0;

  displayedColumns: string[] = ['id', 'station', 'cutter_number', 'cutterName', 'punchIn', 'punchOut', 'actions'];
  frmGrp = this.fb.group({
    dateControl: [new Date(), Validators.required],
    shiftControl: [1, Validators.required],
  });

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  async ngOnInit() {
    this.loading = true;
    this.homeService.serverMap.loadServerMap('production');
    await this.employeeService.loadEmployeesAsync();
    await this.stationService.loadStations();
    const date = this.frmGrp.controls.dateControl.value ?? new Date();
    const shift = this.frmGrp.controls.shiftControl.value ?? 0;
    this.stationService.datasourcePunches.filterPredicate = this.punchesFilterPredicate();
    //await this.stationService.loadPunches(this.homeService.getUnixTimestampDateOnly(date), shift);
    await this.applyFilter();
    this.loading = false;
  }

  punchesFilterPredicate() {
    const myFilterPredicate = (data: IPunch, filter: string): boolean => {
      const filterObject: IPunch = JSON.parse(filter);
      const result = data.deleted === filterObject.deleted;
      return result;
    };
    return myFilterPredicate;
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

  getUnixStartStop(): IUnixStartStop {
    const date = this.frmGrp.controls.dateControl.value ?? new Date();
    const shiftNumber = this.frmGrp.controls.shiftControl.value ?? 0;
    const shiftInfo =
      this.homeService.serverMap.appConfig.shifts.find((s) => s.number === shiftNumber) ??
      ({ number: 0, name: '', start: { hour: 0, minute: 0, offset: 0 }, stop: { hour: 0, minute: 0, offset: 0 } } as IShift);
    const shiftTime = this.homeService.serverMap.getUnixStartStopFromIShift(date, shiftInfo);
    return shiftTime;
  }

  async applyFilter() {
    this.stationService.alert.setInfo('Credit is given to cutters based on time they were punched into a given station.');
    this.stationService.datasourcePunches.filter = JSON.stringify({ deleted: 0 });
    const shiftTime = this.getUnixStartStop();
    await this.stationService.loadPunches(shiftTime.startUnix, shiftTime.stopUnix);
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
    this.stationService.datasourceStations.data.forEach((s) => {
      const emp = this.employeeService.dataSourceEmployeeList.data.find((e) => e.role === s.station && e.shift === shift.number);
      punches.push({
        id: ++this.lastId,
        productionDate: productionDate,
        shift: shift.number,
        cutter_number: emp?.cutter_number || 0,
        // cutternName: emp?.name || '',
        station: s.station,
        punchIn: emp?.cutter_number && emp.cutter_number > 0 ? shiftTime.startUnix : 0,
        punchOut: emp?.cutter_number && emp.cutter_number > 0 ? shiftTime.stopUnix : 0,
        updatedBy: this.authService.loadedUser?.username || 'system',
        updatedAt: this.homeService.getUnixTimestampDateOnly(new Date()),
        deleted: 0,
        //updateAt: this.homeService.getUnixTimestampDateOnly(new Date()),
      });
    });

    // Save to backend
    this.httpClient
      .post<IPunchesResponse>(`/api/punches/savepunches?start=${shiftTime.startUnix}&stop=${shiftTime.stopUnix}`, { punches })
      .subscribe({
        next: () => {
          // this.stationService.datasourcePunches.data = [...punches];
          (async () => {
            await this.stationService.loadPunches(shiftTime.startUnix, shiftTime.stopUnix);
            console.log('Punch saved successfully');
          })();
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
    this.editPunch(punchCopy);
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
      //cutternName: '',
      station: '',
      punchIn: 0,
      punchOut: 0,
      updatedBy: this.authService.loadedUser?.username || 'system',
      deleted: 0,
      updatedAt: this.homeService.getUnixTimestampDateOnly(new Date()),
    };

    this.editPunch(newPunch, 'add');
  }

  editPunch(punch: IPunch, action: 'edit' | 'add' = 'edit') {
    //const shiftTime = this.homeService.serverMap.getUnixStartStopFromIShift(productionDate, shift);
    const shiftTime = this.getUnixStartStop();
    if (punch.punchIn === 0) {
      punch.punchIn = shiftTime.startUnix;
    }
    if (punch.punchOut === 0) {
      punch.punchOut = shiftTime.stopUnix;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '520px';
    dialogConfig.data = { punch, action, shiftTime };
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
            //  this.stationService.datasourcePunches.data = [...data];
          } else {
            data.push(result);
            //  this.stationService.datasourcePunches.data = [...data];
          }
        } else {
          const index = data.findIndex((p: IPunch) => p.station === result.station && p.shift === result.shift);
          if (index !== -1) {
            data[index] = result;
            //  this.stationService.datasourcePunches.data = [...data];
          }
        }
        // Save to backend
        const punches = this.stationService.datasourcePunches.data;

        this.httpClient
          .post<IPunchesResponse>(`/api/punches/savepunches?start=${shiftTime.startUnix}&stop=${shiftTime.stopUnix}`, { punches })
          .subscribe({
            next: () => {
              (async () => {
                await this.stationService.loadPunches(shiftTime.startUnix, shiftTime.stopUnix);
                console.log('Punch saved successfully');
              })();
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
        let data = this.stationService.datasourcePunches.data;
        const count = data.filter((p: IPunch) => p.station === punch.station).length;
        const index = data.findIndex((p: IPunch) => p.id === punch.id);
        const updatedBy = this.authService.loadedUser?.username || 'system';
        const updatedAt = this.homeService.getUnixTimestampDateOnly(new Date());

        if (index !== -1) {
          //if multiple punches exist for the station, delete the punch, else clear the punch info
          if (count > 1) {
            data = data.splice(index, 1);
            //this.stationService.datasourcePunches.data = [...data];
          } else {
            data = data.map((p: IPunch) => {
              if (p.id === punch.id) {
                return { ...p, deleted: 1, updatedBy, updatedAt };
              }
              return p;
            });
          }
          const shiftTime = this.getUnixStartStop();
          this.httpClient
            .post<IPunchesResponse>(`/api/punches/savepunches?start=${shiftTime.startUnix}&stop=${shiftTime.stopUnix}`, { punches: data })
            .subscribe({
              next: () => {
                (async () => {
                  await this.stationService.loadPunches(shiftTime.startUnix, shiftTime.stopUnix);
                  console.log('Punch saved successfully');
                })();
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
        const updatedBy = this.authService.loadedUser?.username || 'system';
        const updatedAt = this.homeService.getUnixTimestampDateOnly(new Date());

        // Filter out punches for the selected date and shift
        // const filteredData = data.filter((p: IPunch) => {
        //   return !(p.productionDate === productionDate && p.shift === shiftControlValue);
        // });

        const deletedData = data.map((p: IPunch) => {
          return { ...p, deleted: 1, updatedBy, updatedAt };
        });

        // Save to backend
        const shiftTime = this.getUnixStartStop();
        this.httpClient
          .post<IPunchesResponse>(`/api/punches/savepunches?start=${shiftTime.startUnix}&stop=${shiftTime.stopUnix}`, { punches: deletedData })
          .subscribe({
            next: () => {
              (async () => {
                await this.stationService.loadPunches(shiftTime.startUnix, shiftTime.stopUnix);
                console.log('Timesheet deleted successfully');
              })();
            },
            error: (error: any) => {
              console.error('Error deleting timesheet:', error);
            },
          });
      }
    });
  }

  // savePunches(punches: IPunch[], shiftTime: { startUnix: number; stopUnix: number }) {
  //       this.httpClient
  //     .post<IPunchesResponse>(`/api/punches/savepunches?start=${shiftTime.startUnix}&stop=${shiftTime.stopUnix}`, { punches })
  //     .subscribe({
  //       next: () => {
  //         // this.stationService.datasourcePunches.data = [...punches];
  //         (async () => {
  //           await this.stationService.loadPunches(shiftTime.startUnix, shiftTime.stopUnix);
  //           console.log('Punch saved successfully');
  //         })();
  //       },
  //       error: (error: any) => {
  //         console.error('Error saving punch:', error);
  //         this.homeService.showAlert('Error', 'Failed to save timesheet. server unreachable.');
  //       },
  //     });
  // }
}
