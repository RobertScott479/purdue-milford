import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { IExportCriteria, StandardReportComponent } from '../../standard-report/standard-report.component';
import { HomeService } from '../../../home.service';
import { YieldService } from '../datasource/yield.service';

@Component({
  selector: 'app-yield-summary',
  standalone: true,
  imports: [StandardReportComponent],
  templateUrl: './yield-summary.component.html',
  styleUrl: './yield-summary.component.scss',
})
export class YieldSummaryComponent implements OnInit, OnDestroy {
  exportSubscription = new Subscription();
  homeService = inject(HomeService);
  yieldService = inject(YieldService);

  displayedColumns = [
    'line',
    //'birds',
    'bpm',
    'fronts',
    'fillets',
    'filletYield',
    'tenders',
    'tenderYield',
    'skins',
    'skinYield',
    'wings',
    'wingsYield',
    'shells',
    'shellsYield',
  ]; //, 'high_g', 'low_g'

  exportSignal: Subject<IExportCriteria> = new Subject();
  sortBy: string = 'scale';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.yieldService.showExportButton.set(true);
    this.exportSubscription = this.yieldService.exportReportEvent$.subscribe((criteria: IExportCriteria) => {
      this.exportSignal.next(criteria);
    });
  }

  ngOnDestroy(): void {
    this.exportSubscription && this.exportSubscription.unsubscribe();
  }
}
