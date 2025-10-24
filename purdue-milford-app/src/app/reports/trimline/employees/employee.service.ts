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
  employeeCategory: string;
  hireDate: string;
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
    employeeCategory: '',
    hireDate: '',
  } as const;
  selectedEmployee: EmployeeInterface = { name: '', role: '', cutter_number: 0, shift: 0, enabled: false, employeeCategory: '', hireDate: '' };
  employeeRoles = ['Cutter', 'Checker'];

  constructor(public httpClient: HttpClient, public dialog: MatDialog, public trimlineService: TrimlineService, public fb: FormBuilder) {
    this.frmGrpEmployeeFilters = this.fb.group({
      shift: [0],
      search: [''],
      activeOnly: [true],
    });
  }

  // loadEmployees(url: string = this.trimlineService.selectedServerHost) {
  //   return this.httpClient.get<EmployeesResInterface>(`${url}/api/employees/loademployees`).pipe(timeout(this.timeoutDelay)).pipe(delay(0)).toPromise();
  // }

  loadEmployees() {
    const host = this.trimlineService.selectedServerHost;
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
        this.dataSourceEmployeeList.sortingDataAccessor = (item: any, property): any => {
          switch (property) {
            case 'hireDate':
              return new Date(item.hireDate);
            default:
              return item[property];
          }
        };
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
    const host = this.trimlineService.selectedServerHost;
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

  // async onImport(event: Event) {
  //   this.alert.clear();
  //   const target = event.target as HTMLInputElement;
  //   const reader = new FileReader();
  //   this.alert.setInfo('Loading file...');
  //   reader.onload = (e: any) => {
  //     const csv = e.target.result;
  //     const rows = csv.split('\n');

  //     let employeeList: EmployeeInterface[] = [];
  //     try {
  //       if (rows.length > 1) {
  //         rows.forEach((e: any, i: number) => {
  //           if (i > 0 && e) {
  //             const cols = this.splitCSV(e.replace('\r', ''));
  //             // if (cols.length === 5) {
  //             if (isNaN(cols[0])) throw `Cutter number must be integer on line ${i + 1}!`;
  //             if (isNaN(cols[3])) throw `Shift must be integer on line ${i + 1}!`;
  //             if (!(cols[4] === 'Cutter' || cols[4] === 'Checker')) throw `Role must be Cutter or Checker on line ${i + 1}!`;
  //             // if (!this.isDateValid(cols[5])) throw `Invalid date on line ${i + 1}!`;
  //             // if (!(cols[6] === 'DGF' || cols[5] === 'CC1' || cols[5] === 'CC2')) throw `Unknown Employee Category on line ${i + 1}!`;
  //             const emp: EmployeeInterface = {
  //               cutter_number: parseInt(cols[0]),
  //               name: `${cols[1]} ${cols[2]}`,
  //               shift: cols[3],
  //               role: cols[4],
  //               enabled: true,
  //               hireDate: cols[5] ?? '',
  //               employeeCategory: cols[6] ?? 'DGF',
  //             };
  //             employeeList.push(emp);
  //             // } else {
  //             //   throw `Expected 5 columns. got ${cols.length} on line ${i + 1}`;
  //             // }
  //           }
  //         });

  //         //remove duplicate cutter_numbers
  //         employeeList = employeeList.filter((value, index, self) => index === self.findIndex((t) => t.cutter_number === value.cutter_number));

  //         (async () => {
  //           this.homeService.dataSourceEmployeeList.data = employeeList;
  //           const errMsg = await this.homeService.saveEmployeesAsync();
  //           if (errMsg === '') {
  //             this.alert.setSuccess('Employee list loaded successfully.');
  //           }
  //         })();
  //         // console.log(employeeList);
  //       } else {
  //         throw 'Nothing to import!';
  //       }
  //     } catch (err) {
  //       this.alert.setError(err);
  //       //console.log(err);
  //     } finally {
  //       this.EmployeeFileInput.nativeElement.value = '';
  //     }
  //   };

  //   reader.readAsText(target.files[0]);
  // }

  // //splits string by comma or quoted block then removes single or double quotes
  // splitCSV(str: string) {
  //   return str.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g).map((val) => {
  //     return val.replace(/^"(.*)"$/, '$1');
  //   });
  // }

  employeefilterPredicate() {
    const myFilterPredicate = (data: EmployeeInterface, filter: string): boolean => {
      const filterObject: IEmployeeFilter = JSON.parse(filter);

      const result =
        filterObject === undefined ||
        ((data.cutter_number.toString().includes(filterObject.search) ||
          data.name.toString().toLowerCase().includes(filterObject.search.toLowerCase()) ||
          filterObject.search == '') &&
          (data.shift == filterObject.shift || filterObject.shift == 0) &&
          (filterObject.activeOnly === false || data.enabled === filterObject.activeOnly));
      return result;
    };
    return myFilterPredicate;
  }
}
