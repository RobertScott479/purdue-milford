import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { debounceTime } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatSortCacheDirective } from '../../../../mat-sort-cache.directive';
import { AlertMessage } from '../../../../layout/alert/alert-message';
import { EmployeeInterface, EmployeeService } from '../employee.service';
import { ConfirmationDialogInterface } from '../../../../layout/confirmation-dialog/confirmation.model';
import { ConfirmationDialogComponent } from '../../../../layout/confirmation-dialog/confirmation-dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerComponent } from '../../../../layout/mat-progress-spinner/mat-progress-spinner.component';
import { AlertComponent } from '../../../../layout/alert/alert.component';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { TrimlineService } from '../../datasource/trimline.service';
import { HomeService } from '../../../../home.service';

@Component({
  selector: 'app-employee-browser',
  templateUrl: './employee-browser.component.html',
  styleUrls: ['./employee-browser.component.scss', '../../../../../styles/table.scss'],
  imports: [
    MatTableModule,
    MatSortModule,
    MatSortCacheDirective,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatProgressSpinnerComponent,
    AlertComponent,
    FormsModule,
    MatLabel,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  standalone: true,
})
export class EmployeeBrowserComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  // alert = new AlertMessage();

  columns = ['row', 'shift', 'employeeCategory', 'hireDate', 'role', 'cutter_number', 'name', 'action'];
  enabledString = ['Off', 'On'];
  addNewDisabled = false;
  showSpinner = false;

  private subscription?: Subscription;

  @ViewChild('EmployeeFile')
  EmployeeFileInput?: ElementRef;
  alert = new AlertMessage();
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator();

  constructor(
    public dialog: MatDialog,

    public employeeService: EmployeeService,
    private router: Router,
    public trimlineService: TrimlineService,
    public homeService: HomeService
  ) {}

  async ngOnInit() {
    await this.onServerChange();
    this.employeeService.loadEmployeesAsync();
    this.employeeService.dataSourceEmployeeList.filterPredicate = this.employeeService.employeefilterPredicate();
    this.setFilter();

    this.employeeService.frmGrpEmployeeFilters
      .get('search')
      .valueChanges.pipe(debounceTime(500))
      .subscribe((val: any) => {
        this.setFilter();
        // this.onSearch(val);
      });
  }

  async onServerChange() {
    this.addNewDisabled = true;
    this.alert.clear();
    this.showSpinner = true;
    const err = await this.employeeService.loadEmployeesAsync();
    this.showSpinner = false;
    if (err === '') {
      this.addNewDisabled = false;
    } else {
      this.alert.setError(err);
    }
  }

  setFilter() {
    const frmGrp = this.employeeService.frmGrpEmployeeFilters;
    this.employeeService.dataSourceEmployeeList.filter = JSON.stringify({
      search: frmGrp.get('search').value,
      shift: frmGrp.get('shift').value,
      activeOnly: true,
    });
  }

  // async onServerChange() {
  //   this.addNewDisabled = true;
  //   this.alert.clear();
  //   this.showSpinner = true;
  //   const err = await this.homeService.loadEmployeesAsync();
  //   this.showSpinner = false;
  //   if (err === '') {
  //     this.addNewDisabled = false;
  //   } else {
  //     this.alert.setError(err);
  //   }
  // }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
    //this.homeService.disableServerSelection = false;
  }

  ngAfterViewInit(): void {
    this.employeeService.dataSourceEmployeeList.sort = this.sort;
    this.employeeService.dataSourceEmployeeList.paginator = this.paginator;
  }

  onSelectionChange() {
    this.alert.clear();
    this.setFilter();
  }

  onEdit(employee: EmployeeInterface | null) {
    if (employee) {
      this.employeeService.selectedEmployee = employee;
    } else {
      this.employeeService.selectedEmployee = this.employeeService.defaultEmployee;
    }
    this.router.navigate(['/home/employeenew']);
  }

  async onDelete(emp: EmployeeInterface) {
    //if (this.userService.canExecute(['Admin', 'Super'], this.router.url)) {
    const dialogData: ConfirmationDialogInterface = {
      title: 'Please Confirm',
      content: 'Are you sure you want to delete this Employee?',
      yesButton: 'Yes',
      cancelButton: 'Cancel',
      returnVal: emp,
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      //height: '350px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((action) => {
      if (action !== 'Yes') return;
      this.showSpinner = true;
      this.employeeService.dataSourceEmployeeList.data = this.employeeService.dataSourceEmployeeList.data.filter(
        (e: EmployeeInterface) => e.cutter_number !== emp.cutter_number
      );

      (async () => {
        const errMsg = await this.employeeService.saveEmployeesAsync();
        this.showSpinner = false;
        window.scrollTo(0, 0);
        if (errMsg === '') {
          this.alert.setSuccess(`\'(${emp.cutter_number})${emp.name}\' was successfully deleted.`);
        }
      })();
    });
    //}
  }

  isDateValid(dateStr: string) {
    return !isNaN(new Date(dateStr).getTime());
  }

  get isAdminOrSuper() {
    // return this.userService.userInRole(UserRoleEnum.Admin) || this.userService.userInRole(UserRoleEnum.Super);
    return true;
  }

  // onExport() {
  //   this.openDialog();
  // }

  // openDialog() {
  //   const employees = this.homeService.copyObject(this.homeService.dataSourceEmployeeList.data);

  //   const dataObj: IExporterData = {
  //     prompt: `Exporting ${this.homeService.selectedServer.server} employees to all servers...`,
  //     endPoint: 'api/employees/saveemployees',
  //     data: { employees: employees as EmployeeInterface[] },
  //   };

  //   const dialogConfig = new MatDialogConfig();

  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;

  //   const dialogRef = this.dialog.open(ExporterComponent, {
  //     width: '980px',
  //     data: dataObj,
  //     disableClose: true,
  //     autoFocus: true,
  //   });
  //   dialogRef.afterClosed().subscribe((dialogAction) => {
  //   });
  // }

  // OnExportCSV() {
  //   const csv = this.convertToCSV(this.homeService.dataSourceEmployeeList.data);
  //   const a = document.createElement('a');
  //   const blob = new Blob([csv], { type: 'text/csv' });
  //   const url = window.URL.createObjectURL(blob);
  //   a.href = url;
  //   a.download = 'cutterExport.csv';
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // }

  // convertToCSV(objArray: EmployeeInterface[]) {
  //   let str = 'Cutter #,	Name,	Shift,	Position,	Hire Date,	Category\r\n';
  //   objArray.forEach((e) => {
  //     str += `${e.cutter_number},${e.name},${e.shift},${e.role},${e.hireDate},${e.employeeCategory}\r\n`;
  //   });
  //   return str;
  // }
}
