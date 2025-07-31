import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpParams } from '@angular/common/http';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';

import { CommonModule, formatDate } from '@angular/common';

import { debounceTime, filter, Subject, Subscription } from 'rxjs';

import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { IExportCriteria, StandardReportComponent } from '../../standard-report/standard-report.component';

import { MatProgressSpinnerComponent } from '../../../layout/mat-progress-spinner/mat-progress-spinner.component';
import { ISummarySizer } from '../datasource/sizer.model';
import { TimeFrame } from '../../report.models';
import { HomeService } from '../../../home.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SizerService } from '../datasource/sizer.service';
import { IShift } from '../../../serverMap';
import { IFrmGroupHistory } from '../../../models';
import { HttpCancelService } from '../../../httpcancel.service';

@Component({
  selector: 'app-sizer-viewer',
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
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './sizer-viewer.component.html',
  styleUrl: './sizer-viewer.component.scss',
})
export class SizerViewerComponent {
  httpCancelService = inject(HttpCancelService);
  homeService = inject(HomeService);
  sizerService = inject(SizerService);
  TimeFrameEnum = TimeFrame;
  mode: 'production' | 'demo' = 'production';
  route = inject(ActivatedRoute);
  router = inject(Router);
  //frmGroupHistorySubscription = new Subscription();
  reportName = '';
  routerSubscription = new Subscription();
  routeSubstription: any;

  async ngOnInit() {
    const frm = this.sizerService.frmGroup.value;

    this.routeSubstription = this.route.firstChild?.url.subscribe((url: any) => {
      if (url[url.length - 1]?.path === 'demo') {
        this.mode = 'demo';
        frm.report = url[url.length - 2]?.path ?? '';
        this.sizerService.frmGroup.get('timeframe')?.setValue(this.TimeFrameEnum.DateShift);
      } else {
        frm.report = url[url.length - 1]?.path ?? '';
      }
      const reportName = this.homeService.upperCaseFirstLetter(frm.report);
      this.sizerService.frmGroup.get('report')?.setValue(reportName);
    });

    await this.homeService.serverMap.loadServerMap(this.mode);
    this.sizerService.onFrmGroupChange();

    this.routerSubscription = this.router.events.pipe(filter((event: any) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      const urlSegments = event.url.split('/');
      frm.report = urlSegments[urlSegments.length - 1] ?? '';
      if (frm.report) {
        const reportName = this.homeService.upperCaseFirstLetter(frm.report);
        this.sizerService.frmGroup.get('report')?.setValue(reportName);

        this.sizerService.onFrmGroupChange();
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscription && this.routerSubscription.unsubscribe();
    this.routeSubstription && this.routeSubstription.unsubscribe();
    this.httpCancelService.cancelPendingRequests();
  }

  onRefresh() {
    this.homeService.alert.clear();
    this.sizerService.fetchDB();
  }

  get reportname() {
    return this.sizerService.frmGroup.get('report')?.value ?? 'Undefined';
  }

  get timeFrame() {
    return this.sizerService.frmGroup.get('timeframe')?.value ?? TimeFrame.Live;
  }

  get shifts() {
    return this.homeService.serverMap.appConfig.shifts;
  }

  // getShiftTime(shift: IShift) {
  //   const frm = this.sizerService.frmGroup.value;

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
    //make sure toDate is always set to the same date as date when timeframe is Archive
    this.sizerService.frmGroup.get('toDate')?.setValue(date);
    this.sizerService.onFrmGroupChange('timeframe');
  }

  onExport() {
    this.homeService.alert.clear();
    const frm = this.sizerService.frmGroup.value as IFrmGroupHistory;

    const selectedShift = frm.shift === 0 ? 'All Shifts' : 'Shift ' + frm.shift;

    let datetimeframe = '';
    // if (frm.timeframe === this.TimeFrameEnum.Live) {
    //   datetimeframe = 'Live Data\n';
    //   if (frm.serverIndex === -1) {
    //     this.sizerService.dataSourceScale.data.forEach((e) => {
    //       datetimeframe += `${e.serverName} Cleared at: ${formatDate(e.cleared * 1000, 'M/d/y h:mm:ss a', 'en-US')}\n`;
    //     });
    //   } else {
    //     datetimeframe = `Cleared at: ${formatDate(
    //       this.sizerService.dataSourceScale.data[frm.serverIndex].cleared * 1000,
    //       'M/d/y h:mm:ss a',
    //       'en-US'
    //     )}\n`;
    //   }

    //   datetimeframe += `Exported at: ${formatDate(new Date(), 'M/dd/yyyy h:mm a', 'en-US')}\n`;
    // }

    if (frm.timeframe === TimeFrame.Archive || frm.timeframe === TimeFrame.DateShift) {
      datetimeframe = 'Production Date: ' + formatDate(frm.date, 'M/dd/yyyy', 'en-US');
      datetimeframe += '\n' + selectedShift;
    }

    if (frm.timeframe === TimeFrame.Custom) {
      datetimeframe = 'From: ' + formatDate(new Date(formatDate(frm.date, 'yyyy-MM-dd ', 'en-US') + frm.fromTime), 'M/dd/yyyy h:mm a', 'en-US');
      datetimeframe += '\nTo: ' + formatDate(new Date(formatDate(frm.toDate, 'yyyy-MM-dd ', 'en-US') + frm.toTime), 'M/dd/yyyy h:mm a', 'en-US');
    }

    const groupBy = ''; // 'Grouped By: Server';

    let header = `${this.sizerService.moduleID} ${frm.report}` + '\n'; //+ '-' + frm.timeframe.toLocaleLowerCase()
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
    this.sizerService.exportReportEvent$.next(exportCriteria);
  }
}
