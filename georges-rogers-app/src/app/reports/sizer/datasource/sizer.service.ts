import { inject, Injectable, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IExportCriteria } from '../../standard-report/standard-report.component';
import { Subject } from 'rxjs';
import { IResponseWithServerInfo, ServerMapInterface } from '../../../serverMap';
import { TimeFrame } from '../../report.models';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HomeService } from '../../../home.service';
import { HttpCancelService } from '../../../httpcancel.service';

import { IComm, IDetail, IRate, IScale, IServer, ISummarySizer } from './sizer.model';
import { GrandTotalSizer } from './grand-totals-sizer';

@Injectable({
  providedIn: 'root',
})
export class SizerService {
  moduleID = 'sizer';
  serverGroups = ['sizer'];
  frmGroup: any;
  showSpinner = signal(false);
  showExportButton = signal(false);
  showTimeFrame = signal(true);
  allowAllServersSelection = signal(false);
  disableRefresh = signal(false);
  disableExport = signal(false);

  exportReportEvent$ = new Subject<IExportCriteria>();

  refreshDelay = 5000;

  servers: ServerMapInterface[] = [];
  tmr: any;

  pollingEnabled = false;
  TimeFrameEnum = TimeFrame;
  dataSourceSummary = new MatTableDataSource<ISummarySizer>();
  dataSourceDetails = new MatTableDataSource<IDetail>();

  grandTotalsSummary = new GrandTotalSizer();
  grandTotalsDetails = new GrandTotalSizer();
  lastPoll = '';
  lastCleared = 0;
  startUnix = 0;
  stopUnix = 0;

  chartImg: string = '';
  rateResponse: IRate[] = [];
  dialog = inject(MatDialog);
  httpResponseEvent$ = new Subject<'sizer-chart-refresh'>();

  constructor(private fb: FormBuilder, public homeService: HomeService) {
    this.frmGroup = this.fb.group({
      serverGroups: [this.serverGroups],
      report: ['Summary'],
      serverIndex: [0],
      timeframe: [TimeFrame.Live],
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
    this.dataSourceDetails.data = [];
    this.grandTotalsSummary.reset();
    this.grandTotalsDetails.reset();
  }

  init() {
    this.servers = this.homeService.serverMap.getServersByGroup(this.serverGroups);
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
    } else if (frm.report === 'Details' || frm.report === 'Histogram') {
      this.dataSourceDetails.data = (await this.homeService.serverMap.fetchDb2(frm)).map((r) => r.response.details).flat();
      this.grandTotalsDetails.updateDetails(this.dataSourceDetails.filteredData);
      this.httpResponseEvent$.next('sizer-chart-refresh');
    } else if (frm.report === 'Rate') {
      this.rateResponse = (await this.homeService.serverMap.fetchDb2(frm)).map((r) => r.response.rate).flat();
      this.httpResponseEvent$.next('sizer-chart-refresh');
    }
    this.showSpinner.set(false);
  }
}
