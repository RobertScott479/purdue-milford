import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { IExportCriteria, StandardReportComponent } from '../../standard-report/standard-report.component';
import { HomeService } from '../../../home.service';
import { SizerService } from '../datasource/sizer.service';

@Component({
  selector: 'app-sizer-summary',
  standalone: true,
  imports: [StandardReportComponent],
  templateUrl: './sizer-summary.component.html',
  styleUrl: './sizer-summary.component.scss',
})
export class SizerSummaryComponent implements OnInit, OnDestroy {
  exportSubscription = new Subscription();
  homeService = inject(HomeService);
  sizerService = inject(SizerService);

  displayedColumns = ['serverName', 'gate', 'count', 'net_lb']; //, 'high_g', 'low_g'

  exportSignal: Subject<IExportCriteria> = new Subject();
  sortBy: string = 'scale';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.sizerService.showExportButton.set(true);
    this.exportSubscription = this.sizerService.exportReportEvent$.subscribe((criteria: IExportCriteria) => {
      this.exportSignal.next(criteria);
    });
  }

  ngOnDestroy(): void {
    this.exportSubscription && this.exportSubscription.unsubscribe();
  }
}
