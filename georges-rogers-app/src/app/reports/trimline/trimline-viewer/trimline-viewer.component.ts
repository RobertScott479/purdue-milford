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

import { IShift } from '../../../serverMap';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IExportCriteria } from '../../standard-report/standard-report.component';
import { IFrmGroupHistory } from '../../../models';

import { TrimlineService } from '../datasource/trimline.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HttpCancelService } from '../../../httpcancel.service';

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
  routerSubscription = new Subscription();
  routeSubstription: any;
  TimeFrameEnum = TimeFrame;

  async ngOnInit() {
    const frm = this.trimlineService.frmGroup.value;

    this.routeSubstription = this.route.firstChild?.url.subscribe((url) => {
      if (url[url.length - 1]?.path === 'demo') {
        this.mode = 'demo';
        frm.report = url[url.length - 2]?.path ?? '';
      } else {
        frm.report = url[url.length - 1]?.path ?? '';
      }
    });

    const reportName = this.homeService.upperCaseFirstLetter(frm.report);
    this.trimlineService.frmGroup.get('report')?.setValue(reportName);

    await this.homeService.serverMap.loadServerMap(this.mode);
    this.trimlineService.onFrmGroupChange();

    this.routerSubscription = this.router.events.pipe(filter((event: any) => event instanceof NavigationEnd)).subscribe((event: any) => {
      const urlSegments = event.url.split('/');
      frm.report = urlSegments[urlSegments.length - 1] ?? '';
      if (frm.report) {
        const reportName = this.homeService.upperCaseFirstLetter(frm.report);
        this.trimlineService.frmGroup.get('report')?.setValue(reportName);
        this.trimlineService.onFrmGroupChange();
      }
    });
  }

  ngOnDestroy() {
    this.trimlineService.trimline.stopRefreshTimer();
    this.routerSubscription && this.routerSubscription.unsubscribe();
    this.routeSubstription && this.routeSubstription.unsubscribe();
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
}
