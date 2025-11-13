import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HomeService } from '../../../home.service';
import { IExportCriteria, StandardReportComponent } from '../../standard-report/standard-report.component';
import { delay, firstValueFrom, Subject, Subscription } from 'rxjs';

import { TrimlineService } from '../datasource/trimline.service';
import { HttpClient } from '@angular/common/http';

export interface ITrimlineSummary {
  line: string;
  station: string;
  cutter: number;
  cutterName: string;
  code: string;
  description: string;
  in_lbs: number;
  gradeA_lbs: number;
  gradeA_yield: number;
  sYieldA: number;
  posYieldA: number;
  gradeB_lbs: number;
  gradeB_yield: number;
  total_lbs: number;
  overall_yield: number;
  aqlScore: number;
  aqlStandard: number;
  posAqlScore: number;
  hours: number;
  ppmh: number;
  sppmh: number;
  posPpmh: number;
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
  //@ts-ignore
  datasource: MatTableDataSource<ITrimlineSummary> = [];

  displayedColumns: (keyof ITrimlineSummary)[] = [
    'line',
    'station',
    'cutter',
    'cutterName',
    'code',
    'description',
    'in_lbs',
    'gradeA_lbs',
    'gradeA_yield',
    'sYieldA',
    'posYieldA',
    'gradeB_lbs',
    'gradeB_yield',
    'total_lbs',
    'overall_yield',
    'aqlScore',
    'posAqlScore',
    'hours',
    'ppmh',
    'sppmh',
    'posPpmh',
  ];

  exportSignal: Subject<IExportCriteria> = new Subject();
  sortBy: string = 'cutter';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.trimlineService.trimlineViewerTitle.set('Trim Summary');
    this.trimlineService.frmGroup.get('report')?.setValue('trimsummary');
    this.trimlineService.onFrmGroupChange();

    this.datasource.filterPredicate = this.filterPredicate();
    this.trimlineService.showExportButton.set(true);
    this.exportSubscription = this.trimlineService.exportReportEvent$.subscribe((criteria: IExportCriteria) => {
      this.exportSignal.next(criteria);
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
    const endpoint = `${host}/api/trimline/summary?start=${unixTimes.startUnix}&stop=${unixTimes.stopUnix}&groupby=${frm.groupBy.toString()}`;
    try {
      this.trimlineService.blinkIndicator(serverIndex, 'unknown');
      const res = await firstValueFrom(
        this.httpClient.get<ITrimlineSummary[]>(endpoint, this.trimlineService.homeService.httpOptions).pipe(delay(3000))
      );
      this.trimlineService.blinkIndicator(serverIndex, 'online');
      this.datasource.data = res;
      this.grandTotals = this.GrandTotalsUpdate(this.datasource.filteredData);
      return res;
    } catch (error) {
      this.trimlineService.blinkIndicator(serverIndex, 'offline');
      this.datasource.data = [];
      this.grandTotals = this.reset();
      this.trimlineService.homeService.serverMap.showServerOfflineWarning();
      return null;
    }
  }

  public reset(): ITrimlineSummary {
    const grandTotals = {
      line: '',
      station: '',
      cutter: 0,
      cutterName: '',
      code: '',
      description: '',
      in_lbs: 0,
      gradeA_lbs: 0,
      gradeA_yield: 0,
      sYieldA: 0,
      posYieldA: 0,
      gradeB_lbs: 0,
      gradeB_yield: 0,
      total_lbs: 0,
      overall_yield: 0,
      aqlScore: 0,
      aqlStandard: 0,
      posAqlScore: 0,
      hours: 0,
      ppmh: 0,
      sppmh: 0,
      posPpmh: 0,
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
      grandTotals.gradeA_lbs += e.gradeA_lbs;
      //grandTotals.gradeA_yield += e.gradeA_yield;
      //grandTotals.sYieldA += e.sYieldA;
      //grandTotals.posYieldA += e.posYieldA;
      grandTotals.gradeB_lbs += e.gradeB_lbs;
      //grandTotals.gradeB_yield += e.gradeB_yield;
      grandTotals.total_lbs += e.total_lbs;
      //grandTotals.overall_yield += e.overall_yield;
      grandTotals.aqlScore += e.aqlScore;
      grandTotals.aqlStandard += e.aqlStandard;
      //grandTotals.posAqlScore += e.posAqlScore;
      grandTotals.hours += e.hours;
      //grandTotals.ppmh += e.ppmh;
      grandTotals.sppmh += e.sppmh;
      //grandTotals.posPpmh += e.posPpmh;
    });
    grandTotals.gradeA_yield = grandTotals.total_lbs > 0 ? (grandTotals.gradeA_lbs / grandTotals.total_lbs) * 100 : 0;
    grandTotals.posYieldA = grandTotals.sYieldA > 0 ? (grandTotals.gradeA_yield / grandTotals.sYieldA) * 100 : 0;
    grandTotals.gradeB_yield = grandTotals.total_lbs > 0 ? (grandTotals.gradeB_lbs / grandTotals.total_lbs) * 100 : 0;
    grandTotals.overall_yield = grandTotals.total_lbs > 0 ? ((grandTotals.gradeA_lbs + grandTotals.gradeB_lbs) / grandTotals.total_lbs) * 100 : 0;
    grandTotals.aqlScore = count > 0 ? grandTotals.aqlScore / count : 0;
    grandTotals.aqlStandard = count > 0 ? grandTotals.aqlStandard / count : 0;
    grandTotals.posAqlScore = count > 0 ? grandTotals.aqlScore / count : 0;
    grandTotals.ppmh = grandTotals.hours > 0 ? grandTotals.total_lbs / grandTotals.hours : 0;
    grandTotals.sppmh = grandTotals.sppmh / count;
    grandTotals.posPpmh = grandTotals.sppmh ? grandTotals.ppmh / grandTotals.sppmh : 0;
    return grandTotals;
  }

  private filterPredicate() {
    const myFilterPredicate = (data: any, filterStr: string): boolean => {
      const filter: any = JSON.parse(filterStr);
      const result = data.serverIndex === filter.serverIndex || filter.serverIndex === -1;
      //&& (data.product_code === filter.product_code || filter.product_code === '') &&

      return result;
    };
    return myFilterPredicate;
  }

  onFrmGroupChange() {
    if (this.trimlineService.frmGroup.valid) {
      const frm = this.trimlineService.frmGroup.value;
      this.updateFilters(frm.serverIndex);
    }
  }

  updateFilters(serverIndex: number | null | undefined) {
    this.datasource.filter = JSON.stringify({
      serverIndex: serverIndex,
    });

    this.GrandTotalsUpdate(this.datasource.filteredData);
  }
}
