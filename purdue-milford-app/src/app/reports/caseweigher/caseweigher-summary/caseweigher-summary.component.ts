import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { IExportCriteria, StandardReportComponent } from '../../standard-report/standard-report.component';
import { Subject, Subscription } from 'rxjs';
import { HomeService } from '../../../home.service';
import { CaseweigherService } from '../datasource/caseweigher.service';

@Component({
  selector: 'app-caseweigher-summary',
  standalone: true,
  imports: [MatTableModule, MatCardModule, StandardReportComponent],
  templateUrl: './caseweigher-summary.component.html',
  styleUrls: ['./caseweigher-summary.component.scss', '../../../../styles/table.scss'],
})
export class CaseweigherSummaryComponent {
  exportSubscription = new Subscription();
  homeService = inject(HomeService);
  caseweigherService = inject(CaseweigherService);

  displayedColumns = ['serverName', 'net_lb', 'count', 'mean', 'over', 'under', 'updated'];

  exportSignal: Subject<IExportCriteria> = new Subject();
  sortBy: string = 'scale';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.caseweigherService.showExportButton.set(true);
    this.exportSubscription = this.caseweigherService.exportReportEvent$.subscribe((criteria: IExportCriteria) => {
      this.exportSignal.next(criteria);
    });
  }

  ngOnDestroy(): void {
    this.exportSubscription && this.exportSubscription.unsubscribe();
  }
}
