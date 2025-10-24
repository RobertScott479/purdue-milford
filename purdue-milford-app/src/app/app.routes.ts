import { Routes } from '@angular/router';

import { DiagnosticsComponent } from './reports/trimline/diagnostics/diagnostics.component';
import { StationsComponent } from './reports/trimline/stations/stations.component';
import { HomeComponent } from './layout/home/home.component';
import { TrimlineSummaryComponent } from './reports/trimline/trimline-summary/trimline-summary.component';
import { QcCheckComponent } from './reports/trimline/qc/qc-check/qc-check.component';
import { Injectable } from '@angular/core';
import { QcLoginComponent } from './reports/trimline/qc/qc-login/qc-login.component';
import { TrimlineViewerComponent } from './reports/trimline/trimline-viewer/trimline-viewer.component';

import { ServersComponent } from './servers/servers.component';

import { EmployeeBrowserComponent } from './reports/trimline/employees/employee-browser/employee-browser.component';
import { EmployeeNewComponent } from './reports/trimline/employees/employee-new/employee-new.component';
import { CutsBrowserComponent } from './reports/trimline/cuts/cuts-browser/cuts-browser.component';
import { CutEditorComponent } from './reports/trimline/cuts/cut-editor/cut-editor.component';
import { AuthGuardService } from './users/login/auth-guard.service';
import { UserRoleEnum } from './users/login/auth-models';
import { UserBrowserComponent } from './users/user-browser/user-browser.component';
import { LoginComponent } from './users/login/login.component';
import { UserEditorComponent } from './users/user-editor/user-editor.component';

@Injectable()
export class SaveFormsGuard {
  canDeactivate(component: any) {
    return component.canDeactivate();
  }
}

export const routes: Routes = [
  { path: '', redirectTo: 'trimline-viewer/summary', pathMatch: 'full' },

  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'employees',
        component: EmployeeBrowserComponent,
        canActivate: [AuthGuardService],
        data: { expectedRoles: [UserRoleEnum.Admin, UserRoleEnum.Super] },
      },
      { path: 'employeenew', component: EmployeeNewComponent, canDeactivate: [SaveFormsGuard] },
      { path: 'stations', component: StationsComponent, canDeactivate: [SaveFormsGuard] },

      {
        path: 'cutsbrowser',
        component: CutsBrowserComponent,
        canActivate: [AuthGuardService],
        data: { expectedRoles: [UserRoleEnum.Admin, UserRoleEnum.Super, UserRoleEnum.User] },
      },
      {
        path: 'cutseditor',
        component: CutEditorComponent,
        canActivate: [AuthGuardService],
        data: { expectedRoles: [UserRoleEnum.Admin, UserRoleEnum.Super] },
        canDeactivate: [SaveFormsGuard],
      },
      { path: 'login/:route', component: LoginComponent },
      { path: 'login', component: LoginComponent },
    ],
  },
  {
    path: 'userbrowser',
    component: UserBrowserComponent,
    canActivate: [AuthGuardService],
    data: { expectedRoles: [UserRoleEnum.Admin, UserRoleEnum.Super] },
  },
  {
    path: 'edituser',
    component: UserEditorComponent,
    canActivate: [AuthGuardService],
    data: { expectedRoles: [UserRoleEnum.Admin] },
  },
  { path: 'servers', component: ServersComponent },

  {
    path: 'trimline-viewer',
    component: TrimlineViewerComponent,
    children: [
      { path: 'summary/:id', component: TrimlineSummaryComponent },
      { path: 'summary', component: TrimlineSummaryComponent },
    ],
  },

  { path: 'qc-login', component: QcLoginComponent },
  { path: 'qc-check', component: QcCheckComponent, canDeactivate: [SaveFormsGuard] }, //, canDeactivate: [SaveFormsGuard]
  { path: '**', redirectTo: 'trimline-viewer/summary', pathMatch: 'full' },
];
