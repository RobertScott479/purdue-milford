import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule, formatDate } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { A11yModule } from '@angular/cdk/a11y';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeInterface, EmployeeService } from '../employees/employee.service';
import { AlertComponent } from '../../../layout/alert/alert.component';
import { AlertMessage } from '../../../layout/alert/alert-message';
import { IShift } from '../../../serverMap';
import { IPunch, StationsService } from '../stations/stations.service';
import { MatSelectModule } from '@angular/material/select';
import { IUnixStartStop } from '../../../home.service';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-punches-dialog',
  templateUrl: './punches-dialog.component.html',
  styleUrls: ['./punches-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    ReactiveFormsModule,
    A11yModule,
    AlertComponent,
    MatSelectModule,
    CdkDrag,
    CdkDragHandle,
    CdkScrollable,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class PunchesDialogComponent implements OnInit {
  alert = new AlertMessage();
  // punch: IPunch;
  punchForm: FormGroup;

  employees: EmployeeInterface[] = [];
  filteredEmployees!: Observable<EmployeeInterface[]>;
  employeesLoaded = false;

  dialogRef = inject<MatDialogRef<PunchesDialogComponent>>(MatDialogRef);
  data = inject<{ punch: IPunch; shift: IShift; action: 'edit' | 'add'; shiftTime: IUnixStartStop }>(MAT_DIALOG_DATA);
  punch: IPunch = this.data.punch;
  shift: IShift = this.data.shift;
  action: 'edit' | 'add' = this.data.action;
  shiftTime: IUnixStartStop = this.data.shiftTime;
  employeeService = inject(EmployeeService);
  stationsService = inject(StationsService);
  fb = inject(FormBuilder);
  stations = this.stationsService.initStations(this.shift.number);

  constructor() {
    this.punch = this.data.punch;
    this.shift = this.data.shift;
    this.action = this.data.action;
    this.shiftTime = this.data.shiftTime;

    // Initialize form with current punch data
    this.punchForm = this.fb.group({
      employee: [null, Validators.required],
      station: ['', Validators.required],
      punchInDate: ['', Validators.required],
      punchOutDate: ['', Validators.required],
      punchInTime: ['', Validators.required],
      punchOutTime: ['', Validators.required],
    });

    if (this.action === 'edit') {
      this.punchForm.controls['station'].disable();
    }
  }

  async ngOnInit() {
    await this.loadEmployees();
  }

  async loadEmployees() {
    try {
      this.employees = this.employeeService.dataSourceEmployeeList.filteredData;
      this.employeesLoaded = true;

      // Set initial employee value
      const employee = this.employees.find((emp) => emp.cutter_number === this.punch.cutter_number);
      this.punchForm.patchValue({
        employee: employee || null,
        station: this.punch.station,
        punchInDate: new Date(this.punch.punchIn * 1000),
        punchOutDate: new Date(this.punch.punchOut * 1000),
        punchInTime: this.formatTimeForInput(this.punch.punchIn),
        punchOutTime: this.formatTimeForInput(this.punch.punchOut),
      });

      // Setup filtering for employee autocomplete
      this.filteredEmployees = this.punchForm.get('employee')!.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterEmployees(value))
      );
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  }

  filterEmployees(value: string | EmployeeInterface | null): EmployeeInterface[] {
    if (!value) {
      return this.employees.slice();
    }

    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
    return this.employees.filter(
      (employee) => employee.name.toLowerCase().includes(filterValue) || employee.cutter_number.toString().includes(filterValue)
    );
  }

  displayEmployee(employee: EmployeeInterface | null): string {
    return employee ? `${employee.name} (${employee.cutter_number})` : '';
  }

  formatTimeForInput(timestamp: number): string {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  parseTimeToUnix(timeString: string, baseDate: number): number {
    if (!timeString) return 0;

    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date(baseDate * 1000);
    date.setHours(hours, minutes, 0, 0);
    return Math.floor(date.getTime() / 1000);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.punchForm.invalid) {
      return;
    }

    const formValue = this.punchForm.getRawValue();
    const station: string = formValue.station;
    const employee = formValue.employee as EmployeeInterface;
    const punchIn = this.parseTimeToUnix(formValue.punchInTime, this.stationsService.homeService.getUnixTimestampDateOnly(formValue.punchInDate));
    const punchOut = this.parseTimeToUnix(formValue.punchOutTime, this.stationsService.homeService.getUnixTimestampDateOnly(formValue.punchOutDate));

    if (punchIn > punchOut) {
      // Invalid: punch out before punch in
      this.alert.setError('Punch Out time cannot be earlier than Punch In time.');
      return;
    }

    if (punchIn < this.shiftTime.startUnix || punchOut > this.shiftTime.stopUnix) {
      this.alert.setError(
        `Punch times must be within the shift time: ${formatDate(this.shiftTime.startUnix * 1000, 'shortTime', 'en-US')} - ${formatDate(
          this.shiftTime.stopUnix * 1000,
          'shortTime',
          'en-US'
        )}`
      );
      return;
    }

    const result: IPunch = {
      ...this.punch,
      id: this.punch.id,
      cutter_number: employee.cutter_number,
      station: station,
      //cutternName: employee ? employee.name : undefined,
      punchIn: punchIn,
      punchOut: punchOut,
    };

    if (!this.validateStationTimestamps(result)) {
      return;
    }

    this.dialogRef.close(result);
  }

  get saveEnabled(): boolean {
    return this.punchForm.valid;
  }

  hasPunchOverlap(punchToValidate: IPunch, punch: IPunch): boolean {
    if (
      (punchToValidate.punchIn >= punch.punchIn && punchToValidate.punchIn <= punch.punchOut) ||
      (punchToValidate.punchOut >= punch.punchIn && punchToValidate.punchOut <= punch.punchOut)
    ) {
      return true;
    }
    return false;
  }

  validateStationTimestamps(punchToValidate: IPunch): boolean {
    let isValid = true;
    this.stationsService.datasourcePunches.filteredData.every((punch) => {
      if (punch.station === punchToValidate.station && (punchToValidate.id === undefined || punch.id !== punchToValidate.id)) {
        if (this.hasPunchOverlap(punchToValidate, punch)) {
          this.alert.setError(`Timestamp conflict with station ${punch.station} for cutter ${punch.cutter_number}`);
          isValid = false;
          return false;
        }
      }

      if (punch.cutter_number === punchToValidate.cutter_number && (punchToValidate.id === undefined || punch.id !== punchToValidate.id)) {
        if (this.hasPunchOverlap(punchToValidate, punch)) {
          this.alert.setError(`Timestamp conflict with station ${punch.station} for cutter ${punch.cutter_number}`);
          isValid = false;
          return false;
        }
      }

      return isValid;
    });
    return isValid;
  }
}
