import { inject, Injectable, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IExportCriteria } from '../../standard-report/standard-report.component';
import { Subject } from 'rxjs';
import { IResponseWithServerInfo, ServerMapInterface } from '../../../serverMap';
import { TimeFrame } from '../../report.models';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HomeService } from '../../../home.service';

import { DistributionGrandTotal } from './yield-grand-totals';
import { ISummaryHopper, ISummeryExtended } from './yield.model';

@Injectable({
  providedIn: 'root',
})
export class YieldService {
  moduleID = 'yield';
  serverGroups = ['fronts', 'fillets', 'tenders', 'wings', 'shells', 'condemned', 'skins'];
  httpResponseEvent$ = new Subject<'yield-chart-refresh'>();
  lineCount = 6;

  showSpinner = signal(false);
  showExportButton = signal(false);
  showTimeFrame = signal(true);
  allowAllServersSelection = signal(true);
  disableRefresh = signal(false);
  disableExport = signal(false);

  frmGroup: any;
  exportReportEvent$ = new Subject<IExportCriteria>();

  refreshDelay = 5000;

  servers: ServerMapInterface[] = [];
  tmr: any;
  //httpCancelService = inject(HttpCancelService);
  pollingEnabled = false;
  TimeFrameEnum = TimeFrame;
  dataSourceSummary = new MatTableDataSource<ISummeryExtended>();
  //dataSourceSummary = signal<MatTableDataSource<ISummeryExtended>>(new MatTableDataSource());

  // dataSourceDetails = new MatTableDataSource<IDetail>();
  // dataSourceComm = new MatTableDataSource<IComm>();
  // dataSourceScale = new MatTableDataSource<IScale>();
  // dataSourceServer = new MatTableDataSource<IServer>();

  grandTotalsSummary = new DistributionGrandTotal();
  //grandTotalsDetails = new DistributionGrandTotal();
  lastPoll = '';
  lastCleared = 0;
  startUnix = 0;
  stopUnix = 0;

  chartImg: string = '';
  //rateResponse: IRate[] = [];
  dialog = inject(MatDialog);

  constructor(private fb: FormBuilder, public homeService: HomeService) {
    this.frmGroup = this.fb.group({
      serverGroups: [this.serverGroups],
      report: ['Summary'],
      serverIndex: [-1],
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
    this.servers = this.homeService.serverMap.dataSource.data.filter((x) => this.serverGroups.includes(x.group) && x.enabled === true);
  }

  onFrmGroupChange(name: string = '') {
    if (this.frmGroup.valid) {
      const frm = this.frmGroup.value;
      localStorage.setItem(`${this.moduleID}.frmGroup`, JSON.stringify(frm));
      this.updateFilters(frm.serverIndex);
      if (name === 'timeframe') {
        this.resetDataSource();
      }
      this.disableRefresh.set(frm.timeframe === TimeFrame.Live ? true : false);
    }
  }

  resetDataSource() {
    this.dataSourceSummary.data = [];
    this.grandTotalsSummary.reset();
  }

  private standardfilterPredicate() {
    const myFilterPredicate = (data: any, filterStr: string): boolean => {
      const filter: any = JSON.parse(filterStr);
      const result = data.serverIndex === filter.serverIndex || filter.serverIndex === -1 || true;
      //&& (data.product_code === filter.product_code || filter.product_code === '') &&

      return result;
    };
    return myFilterPredicate;
  }

  updateFilters(serverIndex: number | null | undefined) {
    this.dataSourceSummary.filter = JSON.stringify({
      serverIndex: serverIndex,
    });

    this.grandTotalsSummary.updateSummary(this.dataSourceSummary.filteredData);
  }

  async fetchDB() {
    this.showSpinner.set(true);
    const frm = this.frmGroup.value;
    if (frm.report === 'Summary') {
      const responsePayload: IResponseWithServerInfo[] = await this.homeService.serverMap.fetchDb2(frm);

      const fillets: ISummaryHopper[][] = responsePayload.filter((r) => r.server.group.split(',').includes('fillets')).map((r) => r.response.summary);
      const tenders: ISummaryHopper[][] = responsePayload.filter((r) => r.server.group.split(',').includes('tenders')).map((r) => r.response.summary);
      const wings: ISummaryHopper[][] = responsePayload.filter((r) => r.server.group.split(',').includes('wings')).map((r) => r.response.summary);
      const shells: ISummaryHopper[][] = responsePayload.filter((r) => r.server.group.split(',').includes('shells')).map((r) => r.response.summary);
      const fronts: ISummaryHopper[][] = responsePayload.filter((r) => r.server.group.split(',').includes('fronts')).map((r) => r.response.summary);
      const skins: ISummaryHopper[][] = responsePayload.filter((r) => r.server.group.split(',').includes('skins')).map((r) => r.response.summary);
      const condemned: ISummaryHopper[] = responsePayload
        .filter((r) => r.server.group.split(',').includes('condemned'))
        .map((r) => r.response.summary);

      const yieldSummary: ISummeryExtended[] = [];

      for (let gate = 1; gate < 7; gate++) {
        var server = 0;
        yieldSummary.push({
          serverIndex: -1,
          serverName: '',
          line: gate,
          birds: Math.floor(fronts[server][gate]?.net_lb / 3.5) || 0,
          fronts: fronts[server][gate]?.net_lb ?? 0,
          fillets: fillets[server][gate]?.net_lb ?? 0,
          tenders: tenders[server][gate]?.net_lb ?? 0,
          wings: wings[server][gate]?.net_lb ?? 0,
          skins: skins[server][gate]?.net_lb ?? 0,
          shells: shells[server][gate]?.net_lb ?? 0,
          condemned: condemned[server]?.net_lb ?? 0,

          filletYield: fronts[server][gate]?.net_lb ?? 0 ? ((fillets[server][gate]?.net_lb ?? 0) / fronts[server][gate].net_lb) * 100 : 0,
          tenderYield: tenders[server][gate]?.net_lb ?? 0 ? ((tenders[server][gate]?.net_lb ?? 0) / fronts[server][gate].net_lb) * 100 : 0,
          wingsYield: fronts[server][gate]?.net_lb ?? 0 ? ((wings[server][gate]?.net_lb ?? 0) / fronts[server][gate].net_lb) * 100 : 0,
          skinYield: fronts[server][gate]?.net_lb ?? 0 ? ((skins[server][gate]?.net_lb ?? 0) / fronts[server][gate].net_lb) * 100 : 0,
          shellsYield: fronts[server][gate]?.net_lb ?? 0 ? ((shells[server][gate]?.net_lb ?? 0) / fronts[server][gate].net_lb) * 100 : 0,
          condemnedYield: condemned[server]?.count ?? 0 ? ((condemned[server]?.count ?? 0) / fronts[server][gate].count) * 100 : 0,
        });
      }

      this.dataSourceSummary.data = yieldSummary;

      this.grandTotalsSummary.updateSummary(this.dataSourceSummary.filteredData);
    }
    this.showSpinner.set(false);
  }
}
