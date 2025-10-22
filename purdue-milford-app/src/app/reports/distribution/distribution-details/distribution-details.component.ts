import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { IExportCriteria, StandardReportComponent } from '../../standard-report/standard-report.component';
import { HomeService } from '../../../home.service';
import { DistributionService } from '../datasource/distribution.service';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-distibution-details',
  standalone: true,
  imports: [StandardReportComponent, MatPaginatorModule],
  templateUrl: './distribution-details.component.html',
  styleUrl: './distribution-details.component.scss',
})
export class DistributionDetailsComponent implements OnInit, OnDestroy {
  exportSubscription = new Subscription();
  homeService = inject(HomeService);
  distributionService = inject(DistributionService);

  displayedColumns = ['serverName', 'gate', 'serial', 'timestamp', 'net_lb'];

  exportSignal: Subject<IExportCriteria> = new Subject();
  sortBy: string = 'serverName';
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
