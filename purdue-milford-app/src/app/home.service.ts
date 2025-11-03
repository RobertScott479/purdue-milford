import { effect, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertMessage } from './layout/alert/alert-message';
import { IExportCriteria } from './reports/standard-report/standard-report.component';
import { IShift, ServerMap, ServerMapInterface } from './serverMap';
import { Trimline } from './reports/trimline/datasource/trimline';

import { Observable, Subject } from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { formatDate } from '@angular/common';
import { BUILD_VERSION, BUILD_DATE, BUILD_NAME, BUILD_INFO } from './version';
import { AlertDialogComponent, AlertDialogInterface } from './alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  title = '';
  appVersion = BUILD_NAME + ' build ' + BUILD_VERSION.replace('.0.0', '');
  buildInfo = BUILD_INFO; // e.g., "@(#)purdue-milford-app build 3.0.0" will be added to the compiled output for scott.
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }) };
  refreshDelay = 5000;
  timeoutDelay = 5000;

  alert = new AlertMessage();

  serverMap: ServerMap;
  //trimline: Trimline;
  //caseweigher: Caseweigher;
  isDarkMode = signal(false);

  patterns: string[] = [];

  constructor(private dialog: MatDialog) {
    this.serverMap = new ServerMap('../assets/serverMap.json');
    this.title = this.serverMap.appConfig.appTitle;
    //this.appVersion = BUILD_VERSION;

    this.initializeTheme();
  }

  delay(ms: number): Promise<any> {
    // const response = new Promise<any>((resolve, reject) => {
    //   setTimeout(() => resolve(true), ms);
    // });
    // return response;
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private initializeTheme(): void {
    // Check for saved preference
    const savedTheme = localStorage.getItem('theme-preference');

    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(prefersDark);
    }

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme-preference')) {
        this.isDarkMode.set(e.matches);
      }
    });
  }

  setDarkMode = effect(() => {
    if (this.isDarkMode()) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('theme-preference', this.isDarkMode() ? 'dark' : 'light');
  });

  upperCaseFirstLetter(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getShiftTime(selectedDate: string, shift: IShift) {
    //const frm = this.frmGroup.value;
    //console.log('selectedDate', selectedDate);
    const dateStart = new Date(selectedDate || new Date());
    dateStart.setDate(dateStart.getDate() + shift.start.offset);
    dateStart.setHours(shift.start.hour, shift.start.minute, 0, 0);

    const dateStop = new Date(selectedDate || new Date());
    dateStop.setDate(dateStop.getDate() + shift.stop.offset);
    dateStop.setHours(shift.stop.hour, shift.stop.minute, 0, 0);

    const start = formatDate(dateStart, 'h:mm a', 'en-US');
    const stop = formatDate(dateStop, 'h:mm a', 'en-US');
    return `  (${start} - ${stop})`;
  }

  timeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const theDate = 'January 1, 2022 ' + value;
      const dateInvalid = isNaN(Date.parse(theDate));
      const result = dateInvalid ? { dateInvalid: true } : null;
      return result;
    };
  }

  async versionCheck(min_version: number) {
    //expects build number to be that last element!
    const appVersion = this.appVersion.split(' ');
    const build = parseInt(appVersion[appVersion.length - 1]);

    if (min_version > build) {
      await this.showAlert('Newer version available', 'Click OK to reload latest.');
    }
  }

  async showAlert(title_: string, content_: string) {
    const dialogData: AlertDialogInterface = {
      title: title_,
      content: content_,
    };
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '450px',
      data: dialogData,
    });

    await dialogRef.afterClosed().toPromise();
    window.location.reload();
  }

  copyObject(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }
}
