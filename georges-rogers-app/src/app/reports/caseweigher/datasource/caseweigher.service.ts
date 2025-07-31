import { inject, Injectable, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TimeFrame } from '../../report.models';
import { HomeService } from '../../../home.service';
import { IExportCriteria } from '../../standard-report/standard-report.component';
import { Subject } from 'rxjs';

import { IResponseWithServerInfo, ServerMapInterface } from '../../../serverMap';
import { HttpCancelService } from '../../../httpcancel.service';
import { MatTableDataSource } from '@angular/material/table';

import { CaseweigherStatsInterface as ICaseweigherSummary, IRate, IServerNameIndex, IDetails } from './caseweigher.model';
import { GrandTotalCaseweigher } from './grand-totals-caseweigher';
import { formatDate } from '@angular/common';
import { ConfirmationDialogInterface } from '../../../layout/confirmation-dialog/confirmation.model';
import { ConfirmationDialogComponent } from '../../../layout/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommInterface, RegisterInterface, ScaleInterface, ServerInterface } from '../diagnostics/diagnostics.model';

@Injectable({
  providedIn: 'root',
})
export class CaseweigherService {
  showSpinner = signal(false);
  showExportButton = signal(false);
  showTimeFrame = signal(true);

  frmGroup: any;
  exportReportEvent$ = new Subject<IExportCriteria>();

  moduleID = 'caseweigher';
  serverGroups = ['caseweigher'];
  servers: ServerMapInterface[] = [];
  tmr: any;

  pollingEnabled = false;
  TimeFrameEnum = TimeFrame;
  dataSourceSummary = new MatTableDataSource<ICaseweigherSummary>();
  dataSourceDetails = new MatTableDataSource<IDetails>();

  dataSourceComm = new MatTableDataSource<CommInterface>();
  dataSourceScale = new MatTableDataSource<ScaleInterface>();
  dataSourceServer = new MatTableDataSource<ServerInterface>();
  dataSourceRegisters = new MatTableDataSource<RegisterInterface>();

  grandTotalsSummary = new GrandTotalCaseweigher();
  grandTotalsDetails = new GrandTotalCaseweigher();
  lastPoll = '';
  lastCleared = 0;
  refreshDelay = 2000;
  startUnix = 0;
  stopUnix = 0;
  disableRefresh = signal(false);
  disableExport = signal(false);
  allowAllServersSelection = signal(false);

  chartImg: string = '';
  rateResponse: IRate[] = [];
  httpResponseEvent$ = new Subject<'rate-refresh'>();

  constructor(private fb: FormBuilder, public homeService: HomeService, public dialog: MatDialog) {
    this.frmGroup = this.fb.group({
      serverGroups: [this.serverGroups],
      report: ['Summary'],
      serverIndex: [0],
      timeframe: [TimeFrame.DateShift],
      date: [new Date(), Validators.required],
      toDate: [new Date(), Validators.required],
      shift: [1],
      fromTime: [
        '12:00 AM',
        [Validators.required, Validators.pattern(/((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/), this.homeService.timeValidator()],
      ],
      toTime: [
        '8:00 PM',
        [Validators.required, Validators.pattern(/((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/), this.homeService.timeValidator()],
      ],
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
    // this.dataSourceComm.filterPredicate = this.standardfilterPredicate();
    // this.dataSourceScale.filterPredicate = this.standardfilterPredicate();
    // this.dataSourceServer.filterPredicate = this.standardfilterPredicate();
  }

  init() {
    this.servers = this.homeService.serverMap.getServersByGroup(this.serverGroups);
    //this.servers = this.homeService.serverMap.dataSource.data.filter((x) => this.serverGroups.includes(x.group) && x.enabled === true);
    // if (live) {
    //   this.startRefreshTimer();
    // } else {
    //   this.stopRefreshTimer();
    // }
  }

  onFrmGroupChange(name: string = '') {
    if (this.frmGroup.valid) {
      const frm = this.frmGroup.value;
      localStorage.setItem(`${this.moduleID}.frmGroup`, JSON.stringify(frm));
      this.updateFilters(frm.serverIndex);
      this.init();
      if (name === 'timeframe') {
        this.resetDataSource();
      }
      this.disableRefresh.set(frm.timeframe === TimeFrame.Live ? true : false);
    }
  }

  resetDataSource() {
    this.dataSourceSummary.data = [];
    this.grandTotalsSummary.reset();
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
    } else if (frm.report === 'Rate') {
      this.rateResponse = (await this.homeService.serverMap.fetchDb2(frm)).map((r) => r.response.rate).flat();
      this.httpResponseEvent$.next('rate-refresh');
    }
    this.showSpinner.set(false);
  }
}
