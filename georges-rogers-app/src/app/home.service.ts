import { effect, Injectable, signal } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AlertMessage } from './layout/alert/alert-message';
import { IExportCriteria } from './reports/standard-report/standard-report.component';
import { IShift, ServerMap, ServerMapInterface } from './serverMap';
import { Trimline } from './reports/trimline/datasource/trimline';

import { Subject } from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  title = '';
  appVersion = '@(#)Georges Rogers build 2\n';

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }) };
  refreshDelay = 5000;
  timeoutDelay = 5000;

  alert = new AlertMessage();

  serverMap: ServerMap;
  //trimline: Trimline;
  //caseweigher: Caseweigher;
  isDarkMode = signal(false);

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.serverMap = new ServerMap('../assets/serverMap.json');
    this.title = this.serverMap.appConfig.appTitle;
    this.initializeTheme();
    this.registerIcons();
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Register all SVG icons
  registerIcons(): void {
    const icons = [
      //miscellaneous icons
      { name: 'analytics', path: 'assets/icons/misc/analytics_24.svg' },
      { name: 'summarize', path: 'assets/icons/misc/summarize.svg' },
      { name: 'list_alt', path: 'assets/icons/misc/list_alt.svg' },
      { name: 'speed', path: 'assets/icons/misc/speed.svg' },
      { name: 'storage', path: 'assets/icons/misc/storage.svg' },
      { name: 'menu', path: 'assets/icons/misc/menu.svg' },
      { name: 'download', path: 'assets/icons/misc/download.svg' },
      { name: 'refresh', path: 'assets/icons/misc/refresh.svg' },
      { name: 'restore', path: 'assets/icons/misc/refresh.svg' },
      { name: 'show_chart', path: 'assets/icons/misc/show_chart.svg' },
      { name: 'home', path: 'assets/icons/misc/home24.svg' },
      { name: 'edit', path: 'assets/icons/misc/edit24.svg' },
      { name: 'lan', path: 'assets/icons/misc/lan24.svg' },
      { name: 'restart_alt', path: 'assets/icons/misc/restart_alt24.svg' },
      { name: 'cloud_download', path: 'assets/icons/misc/cloud_download24.svg' },
      { name: 'add', path: 'assets/icons/misc/add48.svg' },
      { name: 'upload', path: 'assets/icons/misc/file_upload24.svg' },
      { name: 'save', path: 'assets/icons/misc/save24.svg' },
      { name: 'arrow_back', path: 'assets/icons/misc/arrow_back24.svg' },
      { name: 'arrow_forward', path: 'assets/icons/misc/arrow_forward_24.svg' },
      { name: 'delete', path: 'assets/icons/misc/delete24.svg' },
      { name: 'login', path: 'assets/icons/misc/login_24.svg' },
      { name: 'cancel', path: 'assets/icons/misc/cancel_24.svg' },
      { name: 'person', path: 'assets/icons/misc/person_24.svg' },
      { name: 'admin_panel_settings', path: 'assets/icons/misc/admin_panel_settings_24.svg' },
      { name: 'work', path: 'assets/icons/misc/work_24.svg' },
      { name: 'replay', path: 'assets/icons/misc/replay_24.svg' },
      { name: 'play_arrow', path: 'assets/icons/misc/play_arrow_24.svg' },
      { name: 'close', path: 'assets/icons/misc/cancel_24.svg' },
      { name: 'check', path: 'assets/icons/misc/check_24.svg' },
      { name: 'done', path: 'assets/icons/misc/margin_24.svg' },
      { name: 'point_of_sale_48', path: 'assets/icons/misc/point_of_sale_48.svg' },
      { name: 'fact_check', path: 'assets/icons/misc/fact_check_24.svg' },
      { name: 'toggle_on', path: 'assets/icons/misc/toggle_on_24.svg' },
      { name: 'bar_chart', path: 'assets/icons/misc/bar_chart_24.svg' },

      //dashboard icons
      { name: 'light_mode', path: 'assets/icons/dashboard/light_mode.svg' },
      { name: 'dark_mode', path: 'assets/icons/dashboard/dark_mode.svg' },
      { name: 'print48', path: 'assets/icons/dashboard/print48.svg' },
      { name: 'barcode48', path: 'assets/icons/dashboard/barcode48.svg' },
      { name: 'pallet', path: 'assets/icons/dashboard/pallet.svg' },
      { name: 'article', path: 'assets/icons/dashboard/article.svg' },
      { name: 'settings48', path: 'assets/icons/dashboard/settings48.svg' },
      { name: 'group48', path: 'assets/icons/dashboard/group48.svg' },
      { name: 'storage48', path: 'assets/icons/dashboard/storage48.svg' },
      { name: 'person48', path: 'assets/icons/dashboard/person48.svg' },
      { name: 'password48', path: 'assets/icons/dashboard/password48.svg' },

      //designer toolbox icons
      { name: 'barcode', path: 'assets/icons/toolbox/barcode.svg' },
      { name: 'qrcode', path: 'assets/icons/toolbox/qr_code.svg' },
      { name: 'title', path: 'assets/icons/toolbox/title.svg' },
      { name: 'insert_photo', path: 'assets/icons/toolbox/insert_photo.svg' },
      { name: 'crop_square', path: 'assets/icons/toolbox/crop_square.svg' },
      { name: 'radio_button_unchecked', path: 'assets/icons/toolbox/radio_button_unchecked.svg' },
      { name: 'horizontal_rule', path: 'assets/icons/toolbox/horizontal_rule.svg' },

      //designer toolbar icons
      { name: 'align_horizontal_left', path: 'assets/icons/toolbar/align_horizontal_left.svg' },
      { name: 'align_horizontal_right', path: 'assets/icons/toolbar/align_horizontal_right.svg' },
      { name: 'align_vertical_top', path: 'assets/icons/toolbar/align_vertical_top.svg' },
      { name: 'align_vertical_bottom', path: 'assets/icons/toolbar/align_vertical_bottom.svg' },
      { name: 'align_vertical_center', path: 'assets/icons/toolbar/align_vertical_center.svg' },
      { name: 'align_horizontal_center', path: 'assets/icons/toolbar/align_horizontal_center.svg' },
      { name: 'vertical_distribute', path: 'assets/icons/toolbar/vertical_distribute.svg' },
      { name: 'horizontal_distribute', path: 'assets/icons/toolbar/horizontal_distribute.svg' },
      { name: 'zoom_in', path: 'assets/icons/toolbar/zoom_in.svg' },
      { name: 'zoom_out', path: 'assets/icons/toolbar/zoom_out.svg' },
      { name: 'content_cut', path: 'assets/icons/toolbar/content_cut.svg' },
      { name: 'content_copy', path: 'assets/icons/toolbar/content_copy.svg' },
      { name: 'content_paste', path: 'assets/icons/toolbar/content_paste.svg' },
      { name: 'search', path: 'assets/icons/toolbar/search.svg' },
      { name: 'undo', path: 'assets/icons/toolbar/undo.svg' },
      { name: 'redo', path: 'assets/icons/toolbar/redo.svg' },

      //designer menu icons
      { name: 'print', path: 'assets/icons/toolbar/print.svg' },
      { name: 'note_add', path: 'assets/icons/toolbar/note_add.svg' },
      { name: 'folder_open', path: 'assets/icons/toolbar/folder_open.svg' },
      { name: 'preview', path: 'assets/icons/toolbar/preview.svg' },
      { name: 'image', path: 'assets/icons/toolbar/image.svg' },
      { name: 'settings', path: 'assets/icons/toolbar/settings.svg' },

      //dialog icons

      { name: 'error', path: 'assets/icons/alert/error_24.svg' },
      { name: 'info', path: 'assets/icons/alert/info_24.svg' },
      { name: 'check_circle', path: 'assets/icons/alert/check_circle_24.svg' },
      { name: 'warning', path: 'assets/icons/alert/warning_24.svg' },
    ];

    icons.forEach((icon) => {
      this.matIconRegistry.addSvgIcon(icon.name, this.domSanitizer.bypassSecurityTrustResourceUrl(icon.path));
    });
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
}
