import { Routes } from '@angular/router';

import { DiagnosticsComponent } from './reports/trimline/diagnostics/diagnostics.component';
import { StationsComponent } from './reports/trimline/stations/stations.component';
import { HomeComponent } from './layout/home/home.component';
import { TrimlineSummaryComponent } from './reports/trimline/trimline-summary/trimline-summary.component';
import { QcCheckComponent } from './reports/trimline/qc/qc-check/qc-check.component';
import { Injectable } from '@angular/core';
import { QcLoginComponent } from './reports/trimline/qc/qc-login/qc-login.component';
import { TrimlineViewerComponent } from './reports/trimline/trimline-viewer/trimline-viewer.component';
import { CaseweigherSummaryComponent } from './reports/caseweigher/caseweigher-summary/caseweigher-summary.component';
import { CaseweigherDiagnosticsComponent } from './reports/caseweigher/diagnostics/diagnostics.component';
import { CaseweigherDetailsComponent } from './reports/caseweigher/caseweigher-details/caseweigher-details.component';
import { CaseweigherViewerComponent } from './reports/caseweigher/caseweigher-viewer/caseweigher-viewer.component';
import { FloorscaleSummaryComponent } from './reports/floorscale/floorscale-summary/floorscale-summary.component';
import { FloorscaleViewerComponent } from './reports/floorscale/floorscale-viewer/floorscale-viewer.component';
import { floorscaleDiagnosticsComponent } from './reports/floorscale/floorscale-diagnostics/diagnostics.component';
import { FloorscaleDetailsComponent } from './reports/floorscale/floorscale-details/floorscale-details.component';
import { ServersComponent } from './servers/servers.component';
import { CaseweigherRateComponent } from './reports/caseweigher/caseweigher-rate/caseweigher-rate.component';
import { SizerSummaryComponent } from './reports/sizer/sizer-summary/sizer-summary.component';
import { SizerDetailsComponent } from './reports/sizer/sizer-details/sizer-details.component';
import { HistogramComponent } from './reports/sizer/histogram/histogram.component';
import { SizerViewerComponent } from './reports/sizer/sizer-viewer/sizer-viewer.component';
import { SizerRateComponent } from './reports/sizer/sizer-rate/sizer-rate.component';
import { DistributionViewerComponent } from './reports/distribution/distribution-viewer/distribution-viewer.component';
import { DistributionSummaryComponent } from './reports/distribution/distribution-summary/distribution-summary.component';
import { DistributionDetailsComponent } from './reports/distribution/distribution-details/distribution-details.component';
import { YieldSummaryComponent } from './reports/yields/yield-summary/yield-summary.component';
import { YieldViewerComponent } from './reports/yields/yield-viewer/yield-viewer.component';

@Injectable()
export class SaveFormsGuard {
  canDeactivate(component: any) {
    return component.canDeactivate();
  }
}

export const routes: Routes = [
  { path: '', redirectTo: 'caseweigher-viewer/summary', pathMatch: 'full' },

  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'stations', component: StationsComponent, canDeactivate: [SaveFormsGuard] }, //
      { path: 'diagnostics', component: DiagnosticsComponent },
      { path: 'floorscalediagnostics', component: floorscaleDiagnosticsComponent },
    ],
  },
  { path: 'caseweigherdiagnostics', component: CaseweigherDiagnosticsComponent },
  { path: 'servers', component: ServersComponent },
  {
    path: 'caseweigher-viewer',
    component: CaseweigherViewerComponent,
    children: [
      { path: 'summary/:id', component: CaseweigherSummaryComponent },
      { path: 'summary', component: CaseweigherSummaryComponent },
      { path: 'details', component: CaseweigherDetailsComponent },
      { path: 'rate', component: CaseweigherRateComponent },
    ],
  },
  {
    path: 'trimline-viewer',
    component: TrimlineViewerComponent,
    children: [
      { path: 'summary/:id', component: TrimlineSummaryComponent },
      { path: 'summary', component: TrimlineSummaryComponent },
    ],
  },
  {
    path: 'floorscale-viewer',
    component: FloorscaleViewerComponent,
    children: [
      { path: 'summary/:id', component: FloorscaleSummaryComponent },
      { path: 'summary', component: FloorscaleSummaryComponent },
      { path: 'details', component: FloorscaleDetailsComponent },
    ],
  },
  {
    path: 'sizer-viewer',
    component: SizerViewerComponent,
    children: [
      { path: 'summary/:id', component: SizerSummaryComponent },
      { path: 'summary', component: SizerSummaryComponent },
      { path: 'details', component: SizerDetailsComponent },
      { path: 'rate', component: SizerRateComponent },
      { path: 'histogram', component: HistogramComponent },
    ],
  },
  {
    path: 'yields-viewer',
    component: YieldViewerComponent,
    children: [
      { path: 'summary/:id', component: YieldSummaryComponent },
      { path: 'summary', component: YieldSummaryComponent },
    ],
  },
  {
    path: 'distribution-viewer',
    component: DistributionViewerComponent,
    children: [
      { path: 'summary/:id', component: DistributionSummaryComponent },
      { path: 'summary', component: DistributionSummaryComponent },
      { path: 'details', component: DistributionDetailsComponent },
    ],
  },
  { path: 'qc-login', component: QcLoginComponent },
  { path: 'qc-check', component: QcCheckComponent, canDeactivate: [SaveFormsGuard] }, //, canDeactivate: [SaveFormsGuard]
  { path: '**', redirectTo: 'caseweigher-viewer/summary', pathMatch: 'full' },
];
