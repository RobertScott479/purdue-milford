import { Injectable } from '@angular/core';
import { ErrorResInterface } from '../../../models';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AlertMessage, AlertTypeEnum } from '../../../layout/alert/alert-message';
import { MatTableDataSource } from '@angular/material/table';

import { delay, timeout } from 'rxjs';
import { TrimlineService } from '../datasource/trimline.service';
import { FormBuilder } from '@angular/forms';

export interface EmployeeInterface {
  enabled: boolean;
  name: string;
  role: string;
  shift: number;
  cutter_number: number;
  //employeeCategory: string;
  //hireDate: string;
  updatedBy?: string;
  updatedAt?: number;
}

export interface EmployeeRootInterface {
  employees: EmployeeInterface[];
}

export interface EmployeesResInterface extends ErrorResInterface {
  employees: EmployeeInterface[];
}

export interface IEmployeeFilter {
  search: string;
  shift: number;
  activeOnly: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  timeoutDelay = 5000;
  alert = new AlertMessage();
  dataSourceEmployeeList = new MatTableDataSource<EmployeeInterface>();
  frmGrpEmployeeFilters: any;

  defaultEmployee: EmployeeInterface = {
    name: '',
    role: '',
    cutter_number: 0,
    shift: 0,
    enabled: false,
    updatedBy: '',
    updatedAt: 0,
    //employeeCategory: '',
    //hireDate: '',
  } as const;
  selectedEmployee: EmployeeInterface = { name: '', role: '', cutter_number: 0, shift: 0, enabled: false, updatedBy: '', updatedAt: 0 };
  //employeeRoles = ['A01', 'A02', 'A03', 'Checker'];

  constructor(public httpClient: HttpClient, public dialog: MatDialog, public trimlineService: TrimlineService, public fb: FormBuilder) {
    this.frmGrpEmployeeFilters = this.fb.group({
      shift: [0],
      search: [''],
      activeOnly: [true],
    });
  }

  loadEmployees() {
    const host = this.trimlineService.dbServerHost;
    return this.httpClient
      .get<EmployeesResInterface>(`${host}/api/employees/loademployees`)
      .pipe(timeout(this.trimlineService.homeService.timeoutDelay))
      .pipe(delay(0))
      .toPromise();
  }

  async loadEmployeesAsync(): Promise<string> {
    this.alert.clear();

    try {
      const res = (await this.loadEmployees()) ?? { employees: [], errorCode: '-1', errorMessage: 'No response from server' };
      if (res?.errorCode === '0') {
        this.dataSourceEmployeeList.data = res.employees;
        return '';
      } else {
        this.dataSourceEmployeeList.data = [];
        this.alert.set(res.errorMessage, AlertTypeEnum.Error);
        return res.errorMessage;
      }
    } catch (err) {
      this.dataSourceEmployeeList.data = [];
      const errMsg = 'Unable to load Employees. ' + this.alert.getErrorMessage(err);
      this.alert.setError(errMsg);
      return errMsg;
    }
  }

  saveEmployees(employees: EmployeeRootInterface) {
    const host = this.trimlineService.dbServerHost;
    return this.httpClient
      .post<ErrorResInterface>(`${host}/api/employees/saveemployees`, employees, this.trimlineService.homeService.httpOptions)
      .pipe(timeout(this.timeoutDelay))
      .pipe(delay(0))
      .toPromise();
  }

  async saveEmployeesAsync(): Promise<string> {
    const employees: EmployeeRootInterface = { employees: this.dataSourceEmployeeList.data };
    this.alert.clear();

    try {
      const res = (await this.saveEmployees(employees)) ?? { errorCode: '-1', errorMessage: 'No response from server' };
      if (res.errorCode === '0') {
        await this.loadEmployeesAsync();
        return '';
      } else {
        this.alert.set(res.errorMessage, AlertTypeEnum.Error);
        return res.errorMessage;
      }
    } catch (err) {
      const errMsg = 'Unable to confirm save. ' + this.alert.getErrorMessage(err);
      this.alert.setError(errMsg);
      return errMsg;
    }
  }

  employeefilterPredicate() {
    const myFilterPredicate = (data: EmployeeInterface, filter: string): boolean => {
      const filterObject: IEmployeeFilter = JSON.parse(filter);

      const result =
        filterObject === undefined ||
        ((data.cutter_number.toString().includes(filterObject.search) ||
          data.role.toString().includes(filterObject.search) ||
          data.name.toString().toLowerCase().includes(filterObject.search.toLowerCase()) ||
          filterObject.search == '') &&
          (data.shift == filterObject.shift || filterObject.shift == 0) &&
          data.enabled === filterObject.activeOnly);
      return result;
    };
    return myFilterPredicate;
  }

  getEmployeeName(cutterNumber: number): string {
    if (!cutterNumber || cutterNumber === 0) {
      return '';
    }
    const employee = this.dataSourceEmployeeList.data.find((emp) => emp.cutter_number === cutterNumber);
    return employee ? employee.name : '';
  }
}
