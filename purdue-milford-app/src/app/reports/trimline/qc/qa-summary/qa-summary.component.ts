import { Component, OnInit, OnDestroy, inject } from '@angular/core';

import { firstValueFrom, Subject, Subscription } from 'rxjs';
import { IExportCriteria, IFieldName, StandardReportComponent } from '../../../standard-report/standard-report.component';

import { MatTableDataSource } from '@angular/material/table';

import { TrimlineService } from '../../datasource/trimline.service';

import { HttpClient } from '@angular/common/http';

export interface ITrimlineQASummary {
  //line: string;
  station: string;
  code: string;
  description: string;
  cutter?: number;
  cutterName: string;
  checker?: number;
  checkerName: string;
  aqlScore: number;
  aqlStandard: number;
  posAqlScore: number;
  totalChecks: number;
  passedChecks: number;
  passPercent: number;
  defects1: number;
  defects2: number;
  defects3: number;
  defects4: number;
  defects5: number;
  defects6: number;
  defects7: number;
  defects8: number;
  defects9: number;
  defects10: number;
  avgInspectionTime: number;
  weight: number;
  totalDefects: number;
}

@Component({
  selector: 'app-qa-summary',
  templateUrl: './qa-summary.component.html',
  styleUrl: './qa-summary.component.scss',
  standalone: true,
  imports: [StandardReportComponent],
})
export class QaSummaryComponent implements OnInit, OnDestroy {
  httpClient = inject(HttpClient);
  sortBy: string = 'server';
  sortDirection: 'asc' | 'desc' = 'asc';
  exportSignal: Subject<IExportCriteria> = new Subject();
  datasource = new MatTableDataSource<ITrimlineQASummary>();
  exportSubscription = new Subscription();
  refreshSubscription = new Subscription();
  trimlineService = inject(TrimlineService);
  grandTotals: ITrimlineQASummary = this.reset();

  displayedColumns: (keyof ITrimlineQASummary)[] = [
    //'line',
    'station',
    'code',
    'description',
    'cutter',
    'cutterName',
    //'checker',
    //'checkerName',
    'aqlScore',
    //  'aqlStandard',
    'totalChecks',
    'passedChecks',
    'passPercent',
    'defects1',
    'defects2',
    'defects3',
    'defects4',
    'defects5',
    'defects6',
    'defects7',
    'defects8',
    'defects9',
    'defects10',
    'avgInspectionTime',
    'weight',
    'totalDefects',
    //'totalSamples',
    //'aqlQuestions',
  ];

  groupByColumnsQA: IFieldName[] = [
    // { column: 'line', name: 'Line' },
    { column: 'product', name: 'Code' },
    { column: 'station', name: 'Station' },
    { column: 'cutter_number', name: 'Cutter' },
    //  { column: 'checker_cutter_number', name: 'Checker' },
    // { column: 'checker_cutter_number', name: 'Checker' },
  ];

  constructor() {
    this.trimlineService.groupByColumns = this.groupByColumnsQA;
  }

  ngOnInit() {
    this.trimlineService.trimlineViewerTitle.set('QA Summary');
    this.trimlineService.frmGroup.get('report')?.setValue('qasummary');
    this.trimlineService.onFrmGroupChange();

    this.trimlineService.showExportButton.set(true);
    this.exportSubscription = this.trimlineService.exportReportEvent$.subscribe((criteria: IExportCriteria) => {
      const criteriaCpy: IExportCriteria = { ...criteria, reportName: 'QA Summary' };
      this.exportSignal.next(criteriaCpy);
    });

    this.refreshSubscription = this.trimlineService.refreshReportEvent$.subscribe(() => {
      this.onRefresh();
    });
  }

  ngOnDestroy() {
    this.exportSubscription && this.exportSubscription.unsubscribe();
    this.refreshSubscription && this.refreshSubscription.unsubscribe();
  }

  async onRefresh() {
    await this.fetchReport();
  }

  async fetchReport() {
    const serverIndex = 0;
    const host = this.trimlineService.dbServerHost;
    const frm = this.trimlineService.frmGroup.value;
    const unixTimes = this.trimlineService.homeService.serverMap.getUnixStartStop(frm);
    const endpoint = `${host}/api/qc/summary?start=${unixTimes.startUnix}&stop=${unixTimes.stopUnix}&groupby=${frm.groupBy
      .map((item: any) => item.column)
      .join(',')}`;
    try {
      this.trimlineService.blinkIndicator(serverIndex, 'unknown');
      this.trimlineService.showSpinner.set(true);
      const res = await firstValueFrom(this.httpClient.get<ITrimlineQASummary[]>(endpoint, this.trimlineService.homeService.httpOptions));
      this.trimlineService.blinkIndicator(serverIndex, 'online');
      this.trimlineService.showSpinner.set(false);
      this.datasource.data = res;
      this.grandTotals = this.GrandTotalsUpdate(this.datasource.filteredData);
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

  public reset(): ITrimlineQASummary {
    const grandTotals = {
      //line: '',
      station: '',
      code: '',
      description: '',
      cutter: undefined,
      cutterName: '',
      checker: undefined,
      checkerName: '',
      aqlScore: 0,
      aqlStandard: 0,
      posAqlScore: 0,
      totalChecks: 0,
      passedChecks: 0,
      passPercent: 0,
      defects1: 0,
      defects2: 0,
      defects3: 0,
      defects4: 0,
      defects5: 0,
      defects6: 0,
      defects7: 0,
      defects8: 0,
      defects9: 0,
      defects10: 0,
      avgInspectionTime: 0,
      weight: 0,
      totalDefects: 0,
    };

    return grandTotals;
  }

  public GrandTotalsUpdate(summary: ITrimlineQASummary[]): ITrimlineQASummary {
    const grandTotals = this.reset();
    if (!summary || summary.length === 0) {
      return grandTotals;
    }
    let count = 0;
    summary.forEach((e) => {
      count++;
      //grandTotals.cutter = e.cutter;
      //grandTotals.checker = e.checker;
      grandTotals.aqlScore += e.aqlScore;
      grandTotals.aqlStandard += e.aqlStandard;
      grandTotals.totalChecks += e.totalChecks;
      grandTotals.passedChecks += e.passedChecks;
      grandTotals.passPercent += e.passPercent;
      grandTotals.defects1 += e.defects1;
      grandTotals.defects2 += e.defects2;
      grandTotals.defects3 += e.defects3;
      grandTotals.defects4 += e.defects4;
      grandTotals.defects5 += e.defects5;
      grandTotals.defects6 += e.defects6;
      grandTotals.defects7 += e.defects7;
      grandTotals.defects8 += e.defects8;
      grandTotals.defects9 += e.defects9;
      grandTotals.defects10 += e.defects10;
      grandTotals.avgInspectionTime += e.avgInspectionTime;
      grandTotals.weight += e.weight;
      grandTotals.totalDefects += e.totalDefects;
    });
    grandTotals.aqlScore = grandTotals.aqlScore / count;
    grandTotals.aqlStandard = grandTotals.aqlStandard / count;
    grandTotals.posAqlScore = grandTotals.aqlScore / grandTotals.aqlStandard;
    grandTotals.passPercent = (grandTotals.passPercent / grandTotals.totalChecks) * 100;
    grandTotals.avgInspectionTime = grandTotals.avgInspectionTime / count;
    return grandTotals;
  }
}
