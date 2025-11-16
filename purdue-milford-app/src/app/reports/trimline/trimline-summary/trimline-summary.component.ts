import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HomeService } from '../../../home.service';
import { IExportCriteria, IFieldName, StandardReportComponent } from '../../standard-report/standard-report.component';
import { delay, firstValueFrom, Subject, Subscription } from 'rxjs';

import { TrimlineService } from '../datasource/trimline.service';
import { HttpClient } from '@angular/common/http';

export interface ITrimlineSummary {
  // line: string;
  station: string;
  cutter: number;
  cutterName: string;
  code: string;
  description: string;
  in_lbs: number;
  out_lbs: number;
  yield: number;
  standardYield: number;
  posYield: number;
  aqlScore: number;
  aqlStandard: number;
  posAqlScore: number;
  hours: number;
  ppmh: number;
  sppmh: number;
  posPpmh: number;
  pcpm: number;
}

@Component({
  selector: 'app-trimline-summary',
  standalone: true,
  imports: [MatTableModule, MatCardModule, StandardReportComponent],
  templateUrl: './trimline-summary.component.html',
  styleUrls: ['./trimline-summary.component.scss', '../../../../styles/table.scss'],
})
export class TrimlineSummaryComponent {
  httpClient = inject(HttpClient);

  exportSubscription = new Subscription();
  //homeService = inject(HomeService);
  trimlineService = inject(TrimlineService);
  refreshSubscription = new Subscription();

  grandTotals: ITrimlineSummary = this.reset();

  datasource = new MatTableDataSource<ITrimlineSummary>();

  displayedColumns: (keyof ITrimlineSummary)[] = [
    'station',
    'cutter',
    'cutterName',
    'code',
    'description',
    'in_lbs',
    'out_lbs',
    'yield',
    // 'standardYield',
    //'posYield',
    'aqlScore',
    //'posAqlScore',
    'hours',
    'ppmh',
    'pcpm',
    //'sppmh',
    //'posPpmh',
  ];

  groupByColumnsTrim: IFieldName[] = [
    //{ column: 'line', name: 'Line' },
    { column: 'product', name: 'Code' },
    { column: 'station', name: 'Station' },
    { column: 'cutter_number', name: 'Cutter' },
    // { column: 'checker_cutter_number', name: 'Checker' },
    // { column: 'checker_cutter_number', name: 'Checker' },
  ];

  exportSignal: Subject<IExportCriteria> = new Subject();
  sortBy: string = 'cutter';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor() {
    this.trimlineService.groupByColumns = this.groupByColumnsTrim;
  }

  ngOnInit(): void {
    this.trimlineService.trimlineViewerTitle.set('Trim Summary');
    this.trimlineService.frmGroup.get('report')?.setValue('trimsummary');
    this.trimlineService.onFrmGroupChange();

    //this.datasource.filterPredicate = this.filterPredicate();
    this.trimlineService.showExportButton.set(true);
    this.exportSubscription = this.trimlineService.exportReportEvent$.subscribe((criteria: IExportCriteria) => {
      const criteriaCpy: IExportCriteria = { ...criteria, reportName: 'Trimline Summary' };
      this.exportSignal.next(criteriaCpy);
    });

    this.refreshSubscription = this.trimlineService.refreshReportEvent$.subscribe(() => {
      this.onRefresh();
    });
  }

  ngOnDestroy(): void {
    this.exportSubscription && this.exportSubscription.unsubscribe();
    this.refreshSubscription && this.refreshSubscription.unsubscribe();
  }

  async onRefresh() {
    await this.fetchReport();
  }

  async fetchReport() {
    const host = this.trimlineService.dbServerHost;
    const frm = this.trimlineService.frmGroup.value;
    const serverIndex = 0;
    const unixTimes = this.trimlineService.homeService.serverMap.getUnixStartStop(frm);
    const endpoint = `${host}/api/trimline/summary?start=${unixTimes.startUnix}&stop=${unixTimes.stopUnix}&groupby=${frm.groupBy
      .map((item: any) => item.column)
      .join(',')}`;
    try {
      this.trimlineService.blinkIndicator(serverIndex, 'unknown');
      this.trimlineService.showSpinner.set(true);
      const res = await firstValueFrom(
        this.httpClient.get<ITrimlineSummary[]>(endpoint, this.trimlineService.homeService.httpOptions).pipe(delay(0))
      );
      this.trimlineService.showSpinner.set(false);
      this.trimlineService.blinkIndicator(serverIndex, 'online');
      this.datasource.data = [...res];
      this.grandTotals = this.GrandTotalsUpdate(this.datasource.data);
      return res;
    } catch (error) {
      this.trimlineService.blinkIndicator(serverIndex, 'offline');
      this.trimlineService.showSpinner.set(false);
      this.datasource.data = [];
      this.grandTotals = this.reset();
      this.trimlineService.homeService.serverMap.showServerOfflineWarning();
      return null;
    }
  }

  public reset(): ITrimlineSummary {
    const grandTotals = {
      //  line: '',
      station: '',
      cutter: 0,
      cutterName: '',
      code: '',
      description: '',
      in_lbs: 0,
      out_lbs: 0,
      yield: 0,
      standardYield: 0,
      posYield: 0,
      aqlScore: 0,
      aqlStandard: 0,
      posAqlScore: 0,
      hours: 0,
      ppmh: 0,
      sppmh: 0,
      posPpmh: 0,
      pcpm: 0,
    };

    return grandTotals;
  }

  public GrandTotalsUpdate(summary: ITrimlineSummary[]): ITrimlineSummary {
    const grandTotals = this.reset();
    if (!summary || summary.length === 0) {
      return grandTotals;
    }
    let count = 0;
    summary.forEach((e) => {
      count++;
      grandTotals.in_lbs += e.in_lbs;
      grandTotals.out_lbs += e.out_lbs;
      grandTotals.standardYield += e.standardYield;
      grandTotals.aqlScore += e.aqlScore;
      grandTotals.aqlStandard += e.aqlStandard;
      grandTotals.hours += e.hours;
      grandTotals.sppmh += e.sppmh;
      grandTotals.pcpm += e.pcpm;
    });
    grandTotals.yield = grandTotals.in_lbs > 0 ? (grandTotals.out_lbs / grandTotals.in_lbs) * 100 : 0;
    grandTotals.standardYield = count > 0 ? grandTotals.standardYield / count : 0;
    grandTotals.posYield = grandTotals.standardYield > 0 ? (grandTotals.yield / grandTotals.standardYield) * 100 : 0;

    grandTotals.aqlScore = count > 0 ? grandTotals.aqlScore / count : 0;
    grandTotals.aqlStandard = count > 0 ? grandTotals.aqlStandard / count : 0;
    grandTotals.posAqlScore = count > 0 ? grandTotals.aqlScore / count : 0;
    grandTotals.ppmh = grandTotals.hours > 0 ? grandTotals.out_lbs / grandTotals.hours : 0;
    grandTotals.sppmh = grandTotals.sppmh / count;
    grandTotals.posPpmh = grandTotals.sppmh ? grandTotals.ppmh / grandTotals.sppmh : 0;
    grandTotals.pcpm = grandTotals.pcpm > 0 ? grandTotals.pcpm / count : 0;
    return grandTotals;
  }

  private filterPredicate() {
    const myFilterPredicate = (data: any, filterStr: string): boolean => {
      const filter: any = JSON.parse(filterStr);
      const result = data.serverIndex === filter.serverIndex || filter.serverIndex === -1;

      return result;
    };
    return myFilterPredicate;
  }

  onFrmGroupChange() {
    if (this.trimlineService.frmGroup.valid) {
      const frm = this.trimlineService.frmGroup.value;
      // this.updateFilters(frm.serverIndex);
    }
  }

  updateFilters(serverIndex: number | null | undefined) {
    this.datasource.filter = JSON.stringify({
      serverIndex: serverIndex,
    });

    this.GrandTotalsUpdate(this.datasource.filteredData);
  }
}
