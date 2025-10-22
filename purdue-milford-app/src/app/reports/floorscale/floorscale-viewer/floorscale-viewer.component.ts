import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, formatDate } from '@angular/common';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule, MatSuffix } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatCardModule } from '@angular/material/card';
import { HomeService } from '../../../home.service';
import { TimeFrame } from '../../report.models';

import { IShift, ServerMap } from '../../../serverMap';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IExportCriteria } from '../../standard-report/standard-report.component';
import { IFrmGroupHistory } from '../../../models';
import { FloorscaleService } from '../datasource/floorscale.service';
import { MatProgressSpinnerComponent } from '../../../layout/mat-progress-spinner/mat-progress-spinner.component';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpCancelService } from '../../../httpcancel.service';

@Component({
  selector: 'app-floorscale-viewer',
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

    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerComponent,
    MatTimepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './floorscale-viewer.component.html',
  styleUrl: './floorscale-viewer.component.scss',
})
export class FloorscaleViewerComponent {
  httpCancelService = inject(HttpCancelService);
  homeService = inject(HomeService);
  floorscaleService = inject(FloorscaleService);
  TimeFrameEnum = TimeFrame;
  mode: 'production' | 'demo' = 'production';
  route = inject(ActivatedRoute);
  router = inject(Router);
  reportName = '';
  routerSubscription = new Subscription();
  routeSubstription: any;

  async ngOnInit() {
    const frm = this.floorscaleService.frmGroup.value;

    this.routeSubstription = this.route.firstChild?.url.subscribe((url: any) => {
      if (url[url.length - 1]?.path === 'demo') {
        this.mode = 'demo';
        frm.report = url[url.length - 2]?.path ?? '';
        this.floorscaleService.frmGroup.get('timeframe')?.setValue(this.TimeFrameEnum.Live);
      } else {
        frm.report = url[url.length - 1]?.path ?? '';
      }
    });

    await this.homeService.serverMap.loadServerMap(this.mode);
    this.floorscaleService.onFrmGroupChange();

    this.routerSubscription = this.router.events.pipe(filter((event: any) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      const urlSegments = event.url.split('/');
      frm.report = urlSegments[urlSegments.length - 1] ?? '';
      if (frm.report) {
        const reportName = this.homeService.upperCaseFirstLetter(frm.report);
        this.floorscaleService.frmGroup.get('report')?.setValue(reportName);
        this.floorscaleService.onFrmGroupChange();
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscription && this.routerSubscription.unsubscribe();
    this.routeSubstription && this.routeSubstription.unsubscribe();
    this.httpCancelService.cancelPendingRequests();
  }

  // onFrmGroupChange() {
  //   if (this.floorscaleService.frmGroup.valid) {
  //     const frm = this.floorscaleService.frmGroup.value;
  //     localStorage.setItem('floorscale.frmGroup', JSON.stringify(frm));
  //     this.floorscaleService.updateFilters(frm.serverIndex);
  //     //this.floorscaleService.init(frm.timeFrame === this.TimeFrameEnum.Live);
  //   }
  //}

  get reportname() {
    return this.floorscaleService.frmGroup.get('report')?.value ?? 'Undefined';
  }

  get timeFrame() {
    return this.floorscaleService.frmGroup.get('timeframe')?.value ?? TimeFrame.Live;
  }

  get shifts() {
    return this.homeService.serverMap.appConfig.shifts;
  }

  timeChange() {
    this.floorscaleService.resetDataSource();
  }

  // getShiftTime(shift: IShift) {
  //   const frm = this.floorscaleService.frmGroup.value;

  //   const dateStart = new Date(frm.date || new Date());
  //   dateStart.setDate(dateStart.getDate() + shift.start.offset);
  //   dateStart.setHours(shift.start.hour, shift.start.minute, 0, 0);

  //   const dateStop = new Date(frm.date || new Date());
  //   dateStop.setDate(dateStop.getDate() + shift.stop.offset);
  //   dateStop.setHours(shift.stop.hour, shift.stop.minute, 0, 0);

  //   const start = formatDate(dateStart, 'h:mm a', 'en-US');
  //   const stop = formatDate(dateStop, 'h:mm a', 'en-US');
  //   return `  (${start} - ${stop})`;
  // }

  dateChange(date: Date) {
    this.floorscaleService.resetDataSource();
    //make sure toDate is always set to the same date as date when timeframe is Archive
    this.floorscaleService.frmGroup.get('toDate')?.setValue(date);
  }

  onRefresh() {
    this.floorscaleService.fetchDB();
    // this.homeService.alert.clear();
    // if (this.floorscaleService.frmGroup.valid) {
    //   const frm: IFrmGroupHistory = this.floorscaleService.frmGroup.value as IFrmGroupHistory;
    //   const url = this.homeService.serverMap.getJsonData(frm.serverIndex);
    //   this.homeService.serverMap.fetch(0, url);
    // }
  }

  onExport() {
    this.homeService.alert.clear();
    const frm = this.floorscaleService.frmGroup.value as IFrmGroupHistory;

    const selectedShift = frm.shift === 0 ? 'All Shifts' : 'Shift ' + frm.shift;

    let datetimeframe = '';
    if (frm.timeframe === this.TimeFrameEnum.Live) {
      datetimeframe =
        // `Cleared at: ${formatDate(
        //   this.floorscaleService.dataSourceScale.data[frm.serverIndex].cleared * 1000,
        //   'M/d/y h:mm:ss a',
        //   'en-US'
        // )}\n`

        datetimeframe = `Exported at: ${formatDate(new Date(), 'M/dd/yyyy h:mm a', 'en-US')}\n`;
    }

    if (frm.timeframe === TimeFrame.Archive || frm.timeframe === TimeFrame.DateShift) {
      datetimeframe = 'Production Date: ' + formatDate(frm.date, 'M/dd/yyyy', 'en-US');
      datetimeframe += '\n' + selectedShift;
    }

    if (frm.timeframe === TimeFrame.Custom) {
      datetimeframe = 'From: ' + formatDate(new Date(formatDate(frm.date, 'yyyy-MM-dd ', 'en-US') + frm.fromTime), 'M/dd/yyyy h:mm a', 'en-US');
      datetimeframe += '\nTo: ' + formatDate(new Date(formatDate(frm.toDate, 'yyyy-MM-dd ', 'en-US') + frm.toTime), 'M/dd/yyyy h:mm a', 'en-US');
    }

    const groupBy = ''; // 'Grouped By: Server';

    let header = frm.report + '\n'; //+ '-' + frm.timeframe.toLocaleLowerCase()
    const selectedServer = frm.serverIndex === -1 ? 'All Servers' : this.homeService.serverMap.dataSource.data[frm.serverIndex].server;

    header += 'Servers: ' + selectedServer + '\n';
    header += datetimeframe + '\n' + groupBy + '\n';
    // header += 'Unassigned stations: ' + (frm.removeUnassignedStations ? 'removed' : 'included') + '\n';

    const fileDate =
      frm.timeframe === this.TimeFrameEnum.Live || frm.timeframe === this.TimeFrameEnum.Custom
        ? ''
        : `${formatDate(frm.date, 'yyyy-MM-dd', 'en-US')}-${frm.shift}-`;
    const fileName = `${fileDate}${frm.report}.csv`;
    const exportCriteria: IExportCriteria = {
      reportName: frm.report,
      header: header,
      fileName: fileName,
      // displayedColumns: [],
    };
    this.floorscaleService.exportReportEvent$.next(exportCriteria);
  }
}
