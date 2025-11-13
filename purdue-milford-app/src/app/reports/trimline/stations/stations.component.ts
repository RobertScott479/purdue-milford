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
import { ServerMapInterface } from '../../../serverMap';
import { ServerStatusIndicatorsComponent } from '../../../layout/server-status-indicators/server-status-indicators.component';
import { StationsService } from './stations.service';

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
    ServerStatusIndicatorsComponent,
  ],
})
export class StationsComponent implements OnInit, AfterViewInit {
  slideToggleColor: ThemePalette = 'primary';

  action = 'Edit';

  //bStations: StationInterface[] = [];
  //stationsLoaded = signal(false);

  employees: EmployeeInterface[] = [];
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  displayedColumns: string[] = ['enabled', 'station', 'cutter_number', 'name', 'actions'];
  // @ts-ignore
  @ViewChild('myTable', { static: true }) myTable: MatTable<StationInterface>;

  //duplicateCutterNumber = new Map<number, string[]>();
  //primaryCutterList = [];

  constructor(
    public dialog: MatDialog,

    public trimlineService: TrimlineService,
    public employeeService: EmployeeService,
    public stationService: StationsService
  ) {}

  async ngOnInit() {
    this.stationService.alert.clear();
    await this.stationService.loadStations();
  }

  ngAfterViewInit(): void {
    this.stationService.datasource.sort = this.sort;
  }

  onServerChange() {
    this.stationService.loadStations();
  }

  onClear() {
    this.ngOnInit();
  }

  // showAlertDialog(message: string) {
  //   const dialogRef = this.dialog.open(AlertDialogComponent, {
  //     width: '400px',
  //     data: { title: 'Warning', content: message },
  //   });

  //   dialogRef.afterClosed().subscribe((result: any) => {});
  // }

  // async loadEmployees() {
  //   const serverIndex = this.trimlineService.frmGroup.get('serverIndex')?.value ?? -1;
  //   try {
  //     this.trimlineService.blinkIndicator(serverIndex, 'unknown');
  //     const result = await this.employeeService.loadEmployeesAsync();
  //     this.trimlineService.blinkIndicator(serverIndex, 'online');
  //     if (result === '') {
  //       this.employees = this.employeeService.dataSourceEmployeeList.data.filter((emp) => emp.enabled);
  //     }
  //   } catch (error) {
  //     this.trimlineService.blinkIndicator(serverIndex, 'offline');
  //     console.error('Error loading employees:', error);
  //   }
  // }

  onEditStation(station: StationInterface) {
    const shift = station.shift;
    const dialogRef = this.dialog.open(StationEditDialogComponent, {
      width: '400px',

      data: station,
    });

    dialogRef.afterClosed().subscribe((result: StationInterface) => {
      if (result) {
        const index = this.stationService.datasource.data.findIndex((s) => s.station === station.station && s.shift === station.shift);
        if (index !== -1) {
          this.stationService.datasource.data[index] = result;
          this.stationService.dirty = true;
          this.stationService.submitted.set(false);
          this.stationService.onSave();
        }
      }
    });
  }

  // UpdateAll(enabled: boolean) {
  //   this.dirty = true;
  //   this.submitted.set(false);
  //   this.datasource.data = this.datasource.data.map((e) => ({ ...e, enabled }));
  // }

  applyFilter(shift: number) {
    this.stationService.datasource.filter = JSON.stringify({
      shift: shift,
    });
  }

  defaultStations() {
    const stations = this.stationService.initStationList();
    this.stationService.datasource.data = stations;
    this.stationService.dirty = true;
    this.stationService.submitted.set(false);
    this.stationService.onSave();
    return stations;
  }
}
