import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { IExportCriteria, StandardReportComponent } from '../../standard-report/standard-report.component';
import { HomeService } from '../../../home.service';
import { DistributionService } from '../datasource/distribution.service';

@Component({
  selector: 'app-distibution-summary',
  standalone: true,
  imports: [StandardReportComponent],
  templateUrl: './distribution-summary.component.html',
  styleUrl: './distribution-summary.component.scss',
})
export class DistributionSummaryComponent implements OnInit, OnDestroy {
  exportSubscription = new Subscription();
  homeService = inject(HomeService);
  distributionService = inject(DistributionService);

  displayedColumns = ['serverName', 'gate', 'count', 'net_lb']; //, 'high_g', 'low_g'

  exportSignal: Subject<IExportCriteria> = new Subject();
  sortBy: string = 'scale';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.distributionService.showExportButton.set(true);
    this.exportSubscription = this.distributionService.exportReportEvent$.subscribe((criteria: IExportCriteria) => {
      this.exportSignal.next(criteria);
    });
  }

  ngOnDestroy(): void {
    this.exportSubscription && this.exportSubscription.unsubscribe();
  }
}
