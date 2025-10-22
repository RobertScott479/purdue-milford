import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { IExportCriteria, StandardReportComponent } from '../../standard-report/standard-report.component';
import { Subject, Subscription } from 'rxjs';
import { HomeService } from '../../../home.service';
import { FloorscaleService } from '../datasource/floorscale.service';

@Component({
  selector: 'app-floorscale-details',
  imports: [MatTableModule, MatCardModule, StandardReportComponent],
  templateUrl: './floorscale-details.component.html',
  styleUrls: ['./floorscale-details.component.scss', '../../../../styles/table.scss'],
})
export class FloorscaleDetailsComponent {
  exportSubscription = new Subscription();
  homeService = inject(HomeService);
  floorscaleService = inject(FloorscaleService);

  displayedColumns = ['serverName', 'serverGroup', 'net_lb', 'serial', 'timestamp'];

  exportSignal: Subject<IExportCriteria> = new Subject();
  sortBy: string = 'scale';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.floorscaleService.showExportButton.set(true);
    this.exportSubscription = this.floorscaleService.exportReportEvent$.subscribe((criteria: IExportCriteria) => {
      this.exportSignal.next(criteria);
    });
  }

  ngOnDestroy(): void {
    this.exportSubscription && this.exportSubscription.unsubscribe();
  }
}
