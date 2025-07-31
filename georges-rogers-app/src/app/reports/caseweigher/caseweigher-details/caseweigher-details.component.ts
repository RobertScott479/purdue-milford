import { Component, inject } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { HomeService } from '../../../home.service';
import { IExportCriteria, StandardReportComponent } from '../../standard-report/standard-report.component';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CaseweigherService } from '../datasource/caseweigher.service';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-caseweigher-details',
  standalone: true,
  imports: [MatTableModule, MatCardModule, StandardReportComponent, MatPaginatorModule],
  templateUrl: './caseweigher-details.component.html',
  styleUrl: './caseweigher-details.component.scss',
})
export class CaseweigherDetailsComponent {
  exportSubscription = new Subscription();
  homeService = inject(HomeService);
  caseweigherService = inject(CaseweigherService);

  displayedColumns = ['serverName', 'high_limit', 'low_limit', 'net_g', 'status', 'timestamp'];

  exportSignal: Subject<IExportCriteria> = new Subject();
  sortBy: string = 'timestamp';
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
