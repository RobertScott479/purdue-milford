import { inject, Injectable, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TimeFrame } from '../../report.models';
import { HomeService } from '../../../home.service';
import { IExportCriteria } from '../../standard-report/standard-report.component';
import { Subject } from 'rxjs';
import { IFloorScale } from './floorscale.model';
import { MatTableDataSource } from '@angular/material/table';
import { GrandTotalFloorscale } from './grand-totals';
import { ServerMapInterface } from '../../../serverMap';
import { HttpCancelService } from '../../../httpcancel.service';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IComm, IScale } from './diagnostics.model';

@Injectable({
  providedIn: 'root',
})
export class FloorscaleService {
  moduleID = 'floorscale';
  serverGroups = ['floorscale'];
  frmGroup: any;
  showSpinner = signal(false);
  exportReportEvent$ = new Subject<IExportCriteria>();
  showExportButton = signal(false);
  showTimeFrame = signal(true);
  refreshDelay = 5000;

  servers: ServerMapInterface[] = [];
  tmr: any;
  //httpCancelService = inject(HttpCancelService);
  pollingEnabled = false;
  TimeFrameEnum = TimeFrame;

  dataSourceScale = new MatTableDataSource<IScale>();
  dataSourceComm = new MatTableDataSource<IComm>();

  dataSourceSummary = new MatTableDataSource<IFloorScale>();
  dataSourceDetails = new MatTableDataSource<IFloorScale>();

  grandTotalsSummary = new GrandTotalFloorscale();
  grandTotalsDetails = new GrandTotalFloorscale();
  lastPoll = '';
  lastCleared = 0;
  startUnix = 0;
  stopUnix = 0;

  dialog = inject(MatDialog);

  constructor(private fb: FormBuilder, public homeService: HomeService, private httpCancelService: HttpCancelService) {
    this.frmGroup = this.fb.group({
      serverGroups: [this.serverGroups],
      report: ['Summary'],
      serverIndex: [-1],
      timeframe: [TimeFrame.DateShift],
      date: [new Date('8/1/2025'), Validators.required],
      toDate: [new Date(), Validators.required],
      shift: [1],
      fromTime: ['12:00 AM', [Validators.required, Validators.pattern(/((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/), this.timeValidator()]],
      toTime: ['8:00 PM', [Validators.required, Validators.pattern(/((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/), this.timeValidator()]],
    });

    const frmStr = localStorage.getItem(`${this.moduleID}.frmGroup`);
    if (frmStr) {
      const frm = JSON.parse(frmStr);
      frm.serverGroups = this.serverGroups; // Ensure serverGroups is set correctly incase localstorage has an obsolete value
      this.frmGroup.patchValue(frm);
      this.updateFilters(frm.serverIndex);
    }

    this.dataSourceSummary.filterPredicate = this.standardfilterPredicate();
    this.dataSourceDetails.filterPredicate = this.standardfilterPredicate();
  }

  timeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const theDate = 'January 1, 2022 ' + value;
      const dateInvalid = isNaN(Date.parse(theDate));
      const result = dateInvalid ? { dateInvalid: true } : null;
      return result;
    };
  }

  onFrmGroupChange(name: string = '') {
    if (this.frmGroup.valid) {
      const frm = this.frmGroup.value;
      localStorage.setItem(`${this.moduleID}.frmGroup`, JSON.stringify(frm));
      this.updateFilters(frm.serverIndex);
      this.servers = this.homeService.serverMap.getServersByGroup(this.serverGroups);
      if (this.frmGroup.value.serverIndex === -1) {
        this.frmGroup.patchValue({ serverIndex: this.servers[0]?.index || 0 }); // Ensure serverIndex is set to a valid server index
      }
      if (name === 'timeframe') {
        this.resetDataSource();
      }
    }
  }

  resetDataSource() {
    this.grandTotalsSummary.reset();
    this.grandTotalsDetails.reset();

    this.dataSourceSummary.data = [];
    this.dataSourceDetails.data = [];
  }

  private standardfilterPredicate() {
    const myFilterPredicate = (data: any, filterStr: string): boolean => {
      const filter: any = JSON.parse(filterStr);
      const result = data.serverIndex === filter.serverIndex || filter.serverIndex === -1;
      //&& (data.product_code === filter.product_code || filter.product_code === '') &&

      return result;
    };
    return myFilterPredicate;
  }

  updateFilters(serverIndex: number | null | undefined) {
    this.dataSourceSummary.filter = JSON.stringify({
      serverIndex: serverIndex,
    });

    this.dataSourceDetails.filter = JSON.stringify({
      serverIndex: serverIndex,
    });

    this.grandTotalsSummary.updateSummary(this.dataSourceSummary.filteredData);
    this.grandTotalsDetails.updateDetails(this.dataSourceDetails.filteredData);
  }

  async fetchDB() {
    this.showSpinner.set(true);
    const frm = this.frmGroup.value;
    if (frm.report === 'Summary') {
      this.dataSourceSummary.data = (await this.homeService.serverMap.fetchDb2(frm)).map((r) => r.response.summary).flat();
      this.grandTotalsSummary.updateSummary(this.dataSourceSummary.filteredData);
    } else if (frm.report === 'Details') {
      this.dataSourceDetails.data = (await this.homeService.serverMap.fetchDb2(frm)).map((r) => r.response.details).flat();
      this.grandTotalsDetails.updateDetails(this.dataSourceDetails.filteredData);
      //  this.httpResponseEvent$.next('sizer-chart-refresh');
      // } else if (frm.report === 'Rate') {
      //   this.rateResponse = (await this.homeService.serverMap.fetchDb2(frm)).map((r) => r.response.rate).flat();
      //   this.httpResponseEvent$.next('sizer-chart-refresh');
    }
    this.showSpinner.set(false);
  }
}
