import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
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
import { firstValueFrom, Subscription } from 'rxjs';
import { StationInterface } from '../datasource/trimline.model';
import { TrimlineService } from '../datasource/trimline.service';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeService, EmployeeInterface } from '../employees/employee.service';
import { StationEditDialogComponent } from './station-edit-dialog.component';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { AlertDialogComponent } from '../../../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.scss', '../../../../styles/table.scss'],
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
    MatTableModule,
    MatIconModule,
    FormsModule,
    MatSortModule,
  ],
})
export class StationsComponent implements OnInit, AfterViewInit {
  alert = new AlertMessage();

  slideToggleColor: ThemePalette = 'primary';

  action = 'Edit';
  submitted = signal(false);
  dirty = false;
  datasource = new MatTableDataSource<StationInterface>();
  //bStations: StationInterface[] = [];
  //stationsLoaded = signal(false);
  timeoutDelay = 6000;
  showSpinner = signal(false);
  employees: EmployeeInterface[] = [];
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  displayedColumns: string[] = [
    'enabled',
    'station',
    'primaryCutterNumber',
    'primaryCutterName',
    'alternateCutterNumber',
    'alternateCutterName',
    'actions',
  ];
  // @ts-ignore
  @ViewChild('myTable', { static: true }) myTable: MatTable<StationInterface>;

  duplicateCutterNumber = new Map<number, string[]>();
  primaryCutterList = [];

  constructor(
    public dialog: MatDialog,

    public homeService: HomeService,
    public trimlineService: TrimlineService,
    public employeeService: EmployeeService
  ) {}

  async ngOnInit() {
    if (this.trimlineService.frmGroup.get('serverIndex').value == -1) {
      this.trimlineService.frmGroup.get('serverIndex').setValue(0);
    }
    this.trimlineService.trimline.stopRefreshTimer();
    this.alert.clear();
    await this.loadEmployees();
    await this.loadStations();
    this.dirty = false;
  }

  ngAfterViewInit(): void {
    this.datasource.sort = this.sort;
  }

  onServerChange(event: any) {
    this.loadStations();
  }

  onClear() {
    this.ngOnInit();
  }

  async onSave() {
    this.alert.clear();

    this.showSpinner.set(true);
    this.alert.setLight('Saving stations...');
    try {
      const res = await firstValueFrom(this.trimlineService.saveStations(this.datasource.data).pipe(timeout(this.timeoutDelay)).pipe(delay(1000)));

      if (res.errorCode === '0') {
        this.submitted.set(true);
        this.trimlineService.frmGroup.get('serverIndex')?.enable();

        await this.loadStations();
        this.alert.setSuccess('Stations saved');
        await this.homeService.delay(500);
        this.alert.clear();
        this.dirty = false;
      } else {
        this.alert.setError(res.errorMessage);
      }
    } catch (err) {
      this.alert.setError(err);
    }

    this.showSpinner.set(false);
  }

  async loadStations() {
    //this.alert.setLight('Loading stations...');
    this.submitted.set(false);
    this.showSpinner.set(true);
    //this.stationsLoaded.set(false);
    this.duplicateCutterNumber.clear();
    try {
      const res = await firstValueFrom(this.trimlineService.loadStations().pipe(timeout(this.timeoutDelay)).pipe(delay(1000)));
      if (res.errorCode === '0') {
        this.submitted.set(true);
        this.trimlineService.frmGroup.get('serverIndex')?.enable();

        this.datasource.data = res.stations.map((station) => {
          const s = {
            ...station,
            primaryCutterName: this.employeeService.getEmployeeName(station.primaryCutterNumber),
            alternateCutterName: this.employeeService.getEmployeeName(station.alternateCutterNumber),
          };

          const activeCutter = station.alternateCutterNumber ? station.alternateCutterNumber : station.primaryCutterNumber;
          if (this.duplicateCutterNumber.has(activeCutter)) {
            const list = this.duplicateCutterNumber.get(activeCutter) ?? [];
            list.push(station.station);
            this.duplicateCutterNumber.set(activeCutter, list);
          } else {
            this.duplicateCutterNumber.set(activeCutter, [station.station]);
          }

          return s;
        });

        // const state = this.datasource.data.length > 0;
        //this.stationsLoaded.set(state);

        this.alert.clear();
        const warningMessage: string[] = [];
        this.duplicateCutterNumber.forEach((value, key) => {
          if (value.length > 1 && key !== 0) {
            warningMessage.push(`Cutter: ${key}, Assigned To: ${value.join(', ')}`);
          }
        });

        if (warningMessage.length > 0) {
          //this.alert.setWarning('Duplicate Cutter Assignments Detected:\n' + warningMessage.join('\n'));
          // window.alert('Duplicate Cutter Assignments Detected:\n' + warningMessage.join('\n'));
          this.showAlertDialog('Duplicate Cutter Assignments Detected:\n' + warningMessage.join('\n'));
        }
      } else {
        this.datasource.data = [];
        this.alert.setError(res.errorMessage);
      }
    } catch (err) {
      this.alert.setError(err);
    }

    this.showSpinner.set(false);
  }

  showAlertDialog(message: string) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title: 'Warning', content: message },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  async loadEmployees() {
    try {
      const result = await this.employeeService.loadEmployeesAsync();
      if (result === '') {
        this.employees = this.employeeService.dataSourceEmployeeList.data.filter((emp) => emp.enabled);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  }

  onEditStation(station: StationInterface) {
    const dialogRef = this.dialog.open(StationEditDialogComponent, {
      width: '400px',

      data: { station: station },
    });

    dialogRef.afterClosed().subscribe((result: StationInterface) => {
      if (result) {
        const index = this.datasource.data.findIndex((s) => s.station === station.station);
        if (index !== -1) {
          this.datasource.data[index] = result;
          this.dirty = true;
          this.submitted.set(false);
          this.onSave();
        }
      }
    });
  }

  // UpdateAll(enabled: boolean) {
  //   this.dirty = true;
  //   this.submitted.set(false);
  //   this.datasource.data = this.datasource.data.map((e) => ({ ...e, enabled }));
  // }
}
