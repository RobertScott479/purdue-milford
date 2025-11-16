import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { delay, timeout } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';

import { QcService } from '../qc.service';
import { AlertComponent } from '../../../../layout/alert/alert.component';
import { KeypadComponent } from '../../../../keypad/keypad.component';
import { AlertMessage } from '../../../../layout/alert/alert-message';
import { SideNavService } from '../../../../layout/sidenav/sidenav.service';
import { TrimlineService } from '../../datasource/trimline.service';
import { EmployeeService } from '../../employees/employee.service';
import { ErrorResInterface } from '../../../../models';
import { CutsService } from '../../cuts/cuts.service';

@Component({
  selector: 'app-qc-login',
  templateUrl: './qc-login.component.html',
  styleUrls: ['./qc-login.component.scss'],
  standalone: true,
  imports: [AlertComponent, KeypadComponent, MatCardModule],
})
export class QcLoginComponent implements OnInit, OnDestroy {
  alert = new AlertMessage();

  constructor(
    public qcService: QcService,
    private sideNavService: SideNavService,
    private httpClient: HttpClient,
    private router: Router,
    private trimlineService: TrimlineService,
    private employeeService: EmployeeService,
    public cutsService: CutsService
  ) {}

  ngOnInit(): void {
    // this.sideNavService.sideNavMenuDisabled = true;
    // this.sideNavService.sideNavOpened = false;
    this.onKeyPress();
    //this.trimlineService.trimline.stopRefreshTimer();
    this.alert.setLight('You are logged out. Enter your # then press Login to begin');
    this.sideNavService.close();
    this.qcService.activeChecker = { cutter_number: 0, name: '', role: '', shift: 0, enabled: false };
  }

  onKeyPress() {
    this.alert.setLight('Enter your cutter number then press Enter.');
  }

  ngOnDestroy(): void {
    // if (this.router.routerState.snapshot.url.indexOf('qcpo') === -1) {
    //   this.trimlineService.trimline.startRefreshTimer(0);
    // }
    //restart refresh timer?
    //
  }

  async onQCLogin(pin: string) {
    const cutter_number = parseInt(pin);

    if (cutter_number === 99999) {
      this.alert.setWarning(`Anonymous Checker login.`);
      this.qcService.activeChecker = { cutter_number: 99999, name: 'Anonymous', role: 'Checker', shift: 0, enabled: true };
      this.router.navigate(['/qc-check']);
    } else {
      let errMsg = await this.employeeService.loadEmployeesAsync('');
      if (errMsg === '') {
        let err = await this.cutsService.loadCutsAsync1('');
      }
      if (errMsg === '') {
        const checker = this.employeeService.dataSourceEmployeeList.data.find((e) => e.cutter_number == cutter_number && e.role === 'Checker');

        if (checker) {
          this.qcService.activeChecker = checker;
          this.router.navigate(['/qc-check']);
        } else {
          this.alert.setError(`${pin} is not a valid checker number.`);
        }
      } else {
        //this.employeeService.dataSourceEmployeeList.data = [];
        this.alert.setError(errMsg);
      }
    }
  }

  // async loadCutsQCAsync(): Promise<string> {
  //   try {
  //     this.alert.clear();
  //     const res = await this.cutsService.loadCutsAsync();
  //     this.cutsService.dataSourceCutInfo.data = res.cuts;
  //     return '';
  //   }catch (err) {
  //     this.cutsService.dataSourceCutInfo.data = [];
  //     this.alert.setError('Unable to load product cuts. ' + this.alert.getErrorMessage(err));
  //     return this.alert.getErrorMessage(err);
  //   } finally {
  //   }
  // }
}
