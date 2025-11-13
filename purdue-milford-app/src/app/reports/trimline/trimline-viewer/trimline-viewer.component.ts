import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, formatDate } from '@angular/common';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule, MatSuffix } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatProgressSpinnerComponent } from '../../../layout/mat-progress-spinner/mat-progress-spinner.component';
import { MatCardModule } from '@angular/material/card';
import { HomeService } from '../../../home.service';
import { TimeFrame } from '../../report.models';

import { IShift, ServerMapInterface } from '../../../serverMap';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IExportCriteria, IFieldName } from '../../standard-report/standard-report.component';
import { IFrmGroupHistory } from '../../../models';

import { TrimlineService } from '../datasource/trimline.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HttpCancelService } from '../../../httpcancel.service';
import { ServerStatusIndicatorsComponent } from '../../../layout/server-status-indicators/server-status-indicators.component';

@Component({
  selector: 'app-trimline-viewer',
  standalone: true,
  imports: [
    RouterOutlet,

    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,

    CommonModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,

    MatCardModule,
    MatProgressSpinnerComponent,
    MatButtonModule,
    MatIconModule,
    ServerStatusIndicatorsComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './trimline-viewer.component.html',
  styleUrl: './trimline-viewer.component.scss',
})
export class TrimlineViewerComponent {
  httpCancelService = inject(HttpCancelService);
  homeService = inject(HomeService);
  trimlineService = inject(TrimlineService);

  mode: 'production' | 'demo' = 'production';
  route = inject(ActivatedRoute);
  router = inject(Router);
  //frmGroupHistorySubscription = new Subscription();
  reportName = '';
  //routeSubscription = new Subscription();
  //routeSubscription: any;
  TimeFrameEnum = TimeFrame;

  serverList: ServerMapInterface[] = [];

  groupByColumns: IFieldName[] = [
    { column: 'line', name: 'Line' },
    { column: 'product', name: 'Code' },
    { column: 'station', name: 'Station' },
    { column: 'cutter_number', name: 'Cutter' },
    { column: 'checker_cutter_number', name: 'Checker' },
    // { column: 'checker_cutter_number', name: 'Checker' },
  ];

  async ngOnInit() {
    this.route.firstChild?.url.subscribe((url) => {
      if (url[url.length - 1]?.path === 'demo') {
        this.mode = 'demo';
      }
    });

    await this.homeService.serverMap.loadServerMap(this.mode);
    this.serverList = this.homeService.serverMap.getServersByGroup(['dbserver']);
    this.trimlineService.blinkIndicatorEvent$.subscribe((serverState) => {
      if (serverState.index >= 0 && serverState.index < this.homeService.serverMap.dataSource.data.length) {
        this.homeService.serverMap.dataSource.data[serverState.index].state = serverState.state;
      } else {
        console.warn('Invalid server index for blinkIndicatorEvent$', serverState);
      }
    });
  }

  ngOnDestroy() {
    this.httpCancelService.cancelPendingRequests();
  }

  get reportname() {
    return this.trimlineService.frmGroup.get('report')?.value ?? 'Undefined';
  }

  get timeFrame() {
    return this.trimlineService.frmGroup.get('timeframe')?.value ?? TimeFrame.Live;
  }

  get shifts() {
    return this.homeService.serverMap.appConfig.shifts;
  }

  onRefresh() {
    this.trimlineService.refreshReportEvent$.next(null);
  }
}
