import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { IExportCriteria, StandardReportComponent } from '../../standard-report/standard-report.component';
import { HomeService } from '../../../home.service';
import { SizerService } from '../datasource/sizer.service';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-sizer-details',
  standalone: true,
  imports: [StandardReportComponent, MatPaginatorModule],
  templateUrl: './sizer-details.component.html',
  styleUrl: './sizer-details.component.scss',
})
export class SizerDetailsComponent implements OnInit, OnDestroy {
  exportSubscription = new Subscription();
  homeService = inject(HomeService);
  sizerService = inject(SizerService);

  displayedColumns = ['serverName', 'gate', 'serial', 'timestamp', 'net_g'];

  exportSignal: Subject<IExportCriteria> = new Subject();
  sortBy: string = 'serverName';
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
