import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeInterface, EmployeeService } from '../employees/employee.service';
import { StationInterface } from '../datasource/trimline.model';

export interface StationEditDialogData {
  station: StationInterface;
}

@Component({
  selector: 'app-station-edit-dialog',
  templateUrl: './station-edit-dialog.component.html',
  styleUrls: ['./station-edit-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class StationEditDialogComponent implements OnInit {
  station: StationInterface;
  enabled: boolean;
  primaryEmployeeControl = new FormControl<EmployeeInterface | string | null>(null, Validators.required);
  //alternateEmployeeControl = new FormControl<EmployeeInterface | string | null>(null);

  employees: EmployeeInterface[] = [];
  filteredPrimaryEmployees!: Observable<EmployeeInterface[]>;
  //filteredAlternateEmployees!: Observable<EmployeeInterface[]>;

  employeesLoaded = false;
  dialogRef = inject<MatDialogRef<StationEditDialogComponent>>(MatDialogRef);
  data = inject<StationInterface>(MAT_DIALOG_DATA);
  employeeService = inject(EmployeeService);

  constructor() {
    this.station = this.data;
    this.enabled = this.station.enabled;
  }

  async ngOnInit() {
    await this.loadEmployees();
  }

  async loadEmployees() {
    try {
      //const result = await this.employeeService.loadEmployeesAsync();
      //if (result === '') {
      this.employees = this.employeeService.dataSourceEmployeeList.data;
      this.employeesLoaded = true;

      // Set initial values
      const primaryEmployee = this.employees.find((emp) => emp.cutter_number === this.station.cutter_number);

      this.primaryEmployeeControl.setValue(primaryEmployee || null);

      // Setup filtering
      this.filteredPrimaryEmployees = this.primaryEmployeeControl.valueChanges.pipe(
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

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const primaryEmployee = this.primaryEmployeeControl.value as EmployeeInterface | null;
    //const alternateEmployee = this.alternateEmployeeControl.value as EmployeeInterface | null;

    const result: StationInterface = {
      ...this.station,
      enabled: this.enabled,
      cutter_number: primaryEmployee ? primaryEmployee.cutter_number : 0,
      //  alternateCutterNumber: alternateEmployee ? alternateEmployee.cutter_number : 0,
    };

    this.dialogRef.close(result);
  }

  get saveEnabled() {
    return !this.enabled || (this.enabled && this.primaryEmployeeControl.valid);
  }

  toggleChanged(event: any) {
    if (event.checked) {
      this.primaryEmployeeControl.enable();
      //this.alternateEmployeeControl.enable();
    } else {
      this.primaryEmployeeControl.disable();
      //this.alternateEmployeeControl.disable();
    }
  }
}
