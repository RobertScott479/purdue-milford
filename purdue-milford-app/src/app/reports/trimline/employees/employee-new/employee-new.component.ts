import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationDialogInterface } from '../../../../layout/confirmation-dialog/confirmation.model';
import { ConfirmationDialogComponent } from '../../../../layout/confirmation-dialog/confirmation-dialog.component';
import { TrimlineService } from '../../datasource/trimline.service';
import { AlertMessage } from '../../../../layout/alert/alert-message';
import { EmployeeInterface, EmployeeService } from '../employee.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AlertComponent } from '../../../../layout/alert/alert.component';
import { MatProgressSpinnerComponent } from '../../../../layout/mat-progress-spinner/mat-progress-spinner.component';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HomeService } from '../../../../home.service';

@Component({
  selector: 'app-employee-new',
  templateUrl: './employee-new.component.html',
  styleUrls: ['./employee-new.component.scss'],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatProgressBarModule,
    AlertComponent,
    MatProgressSpinnerComponent,
    MatSelectModule,
    MatIconModule,
    CommonModule,
    MatInputModule,
    MatSlideToggleModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
  ],
})
export class EmployeeNewComponent implements OnInit, OnDestroy {
  title = 'Add New Cutter';
  isDirty = true;
  //alert = new AlertMessage();

  showSpinner = false;
  formGrp: any;
  public noWhitespaceValidator(control: UntypedFormControl) {
    const isWhitespace = (control.value || '').trim().length !== (control.value || '').length;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  // alert = new AlertMessage();
  constructor(
    public dialog: MatDialog,
    public employeeService: EmployeeService,
    private route: Router,
    public fb: FormBuilder,
    public homeService: HomeService
  ) {
    this.formGrp = this.fb.group({
      cutter_number: [0, Validators.required],
      name: ['', [Validators.required, Validators.pattern(/^((?!,).)*$/m)]],
      role: ['', [Validators.required]],
      enabled: [true],
      shift: [this.employeeService.trimlineService.frmGroup.shift, Validators.required],
      employeeCategory: ['DGF', Validators.required],
      hireDate: [''],
    });
  }

  ngOnInit(): void {
    //this.homeService.disableServerSelection = true;
    this.employeeService.alert.clear();
    if (this.employeeService.selectedEmployee.cutter_number === 0) {
      this.title = 'Add New cutter';
      //if all shift was selected force shift selection from dropdown
      if (this.formGrp.get('shift').value == 0) {
        this.formGrp.get('shift').setValue('');
      }
    } else {
      this.title = 'Update cutter';
      const frm =
        this.employeeService.dataSourceEmployeeList.data.find((e) => e.cutter_number === this.employeeService.selectedEmployee.cutter_number) ??
        this.employeeService.defaultEmployee;
      this.formGrp.get('cutter_number').setValue(frm.cutter_number);
      this.formGrp.get('name').setValue(frm.name);
      this.formGrp.get('role').setValue(frm.role);
      this.formGrp.get('enabled').setValue(frm.enabled);
      this.formGrp.get('shift').setValue(frm.shift);
      this.formGrp.get('employeeCategory').setValue(frm.employeeCategory);
      this.formGrp.get('hireDate').setValue(frm.hireDate);
    }
  }

  ngOnDestroy(): void {
    //this.employeeService.disableServerSelection = false;
  }

  async canDeactivate(): Promise<boolean> {
    if (this.formGrp.dirty && this.isDirty) {
      const dialogData: ConfirmationDialogInterface = {
        title: 'Please Confirm',
        content: 'You have unsaved changes. Continue anyway?',
        returnVal: '',
      };
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '450px',
        data: dialogData,
      });

      const response = await dialogRef.afterClosed().toPromise();
      if (response === undefined) {
        return false;
      } else {
        this.onCancel();
        return true;
      }
    }
    return true;
  }

  async onSubmit() {
    let name = this.formGrp.get('name').value;
    this.formGrp.get('name').setValue(name.trim());
    if (this.formGrp.valid) {
      const frm: EmployeeInterface = this.formGrp.value;

      if (this.employeeService.selectedEmployee.cutter_number === 0) {
        //add
        let row = this.employeeService.dataSourceEmployeeList.data.find((e) => e.cutter_number == frm.cutter_number);
        if (!row) {
          frm.cutter_number = parseInt(frm.cutter_number.toString());
          this.employeeService.dataSourceEmployeeList.data.push(frm);
          this.showSpinner = true;
          const errMsg = await this.employeeService.saveEmployeesAsync();
          this.showSpinner = false;
          if (errMsg === '') {
            this.route.navigate(['/home/employees']);
            this.isDirty = false;
          }
        } else {
          this.employeeService.alert.setError('This cutter number already exists.  Cutter number must be unique');
        }
      } else {
        //update
        //if dataSourceEmployeeList name changed then update name in dataSourceStations as well.  NOTE: this doesn't change the historical data!
        const idx = this.employeeService.dataSourceEmployeeList.data.findIndex(
          (e) => e.cutter_number === this.employeeService.selectedEmployee.cutter_number
        );
        let employeeRow = this.employeeService.dataSourceEmployeeList.data[idx];

        let dupRow = this.employeeService.dataSourceEmployeeList.data.find((e, i) => e.cutter_number == frm.cutter_number && i !== idx);
        if (dupRow) {
          this.employeeService.alert.setError('This cutter number already exists.  Cutter number must be unique');
        } else {
          employeeRow.cutter_number = frm.cutter_number;
          employeeRow.name = frm.name;
          employeeRow.role = frm.role;
          employeeRow.enabled = frm.enabled;
          employeeRow.shift = frm.shift;
          employeeRow.employeeCategory = frm.employeeCategory;
          employeeRow.hireDate = frm.hireDate;
          this.showSpinner = true;
          const errMsg = await this.employeeService.saveEmployeesAsync();
          this.showSpinner = false;
          if (errMsg === '') {
            this.route.navigate(['/home/employees']);
            this.isDirty = false;
          }
        }
      }
    } else {
      this.employeeService.alert.setError('Please correct all issues and submit again.');
    }
    window.scrollTo(0, 0);
  }

  onCancel() {
    this.isDirty = false;
    this.formGrp.reset();
    this.ngOnInit();
  }

  onBack() {
    this.route.navigate(['/home/employees']);
  }

  getErrorMessage(fieldName: string) {
    if (this.formGrp.get(fieldName).hasError('pattern')) {
      if (fieldName === 'cutter_number') {
        return 'Expecting 0-99999';
      } else if (fieldName === 'name') {
        return 'Commas not allowed';
      } else return 'Pattern';
    } else if (this.formGrp.get(fieldName).hasError('max')) {
      return 'value to large';
    } else if (this.formGrp.get(fieldName).hasError('min')) {
      return 'value to small';
    } else if (this.formGrp.get(fieldName).hasError('required')) {
      return 'Required';
    } else {
      return 'Invalid value';
    }
  }
}
