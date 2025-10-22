import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HomeService } from '../../../home.service';
import { IExportCriteria, StandardReportComponent } from '../../standard-report/standard-report.component';
import { Subject, Subscription } from 'rxjs';

import { GrandTotalSummary } from '../datasource/grand-totals';
import { TrimlineService } from '../datasource/trimline.service';

@Component({
  selector: 'app-trimline-summary',
  standalone: true,
  imports: [MatTableModule, MatCardModule, StandardReportComponent],
  templateUrl: './trimline-summary.component.html',
  styleUrls: ['./trimline-summary.component.scss', '../../../../styles/table.scss'],
})
export class TrimlineSummaryComponent {
  exportSubscription = new Subscription();
  homeService = inject(HomeService);
  trimlineService = inject(TrimlineService);
  //httpResponseSubscription = new Subscription();

  grandTotals?: GrandTotalSummary;
  //@ts-ignore
  dataSource: MatTableDataSource<CutterInterface>;
  displayedColumns = [
    'serverName',
    'station_name',
    'in_lbs',
    'out_lbs',
    'yield_percent',
    'qc_fail_count',
    'qc_pass_count',
    'qc_score',
    //'work_seconds',
    'hours',
    'ppmh',
  ];

  exportSignal: Subject<IExportCriteria> = new Subject();
  sortBy: string = 'gate';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.trimlineService.showExportButton.set(true);
    this.exportSubscription = this.trimlineService.exportReportEvent$.subscribe((criteria: IExportCriteria) => {
      this.exportSignal.next(criteria);
    });
  }

  ngOnDestroy(): void {
    this.exportSubscription && this.exportSubscription.unsubscribe();
    // this.httpResponseSubscription && this.httpResponseSubscription.unsubscribe();
  }
}
