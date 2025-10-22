import { Injectable, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TimeFrame } from '../../report.models';
import { HomeService } from '../../../home.service';
import { StationInterface, StationRootInterface, StationsResInterface } from './trimline.model';
import { ErrorResInterface, IFrmGroupHistory } from '../../../models';
import { HttpClient } from '@angular/common/http';
import { IExportCriteria } from '../../standard-report/standard-report.component';
import { Subject } from 'rxjs';
import { Trimline } from './trimline';
import { formatDate } from '@angular/common';
import { IShift, ServerMapInterface } from '../../../serverMap';

@Injectable({
  providedIn: 'root',
})
export class TrimlineService {
  moduleID = 'trimline';
  serverGroups = ['trimline'];
  frmGroup: any;
  showSpinner = signal(false);
  exportReportEvent$ = new Subject<IExportCriteria>();
  showExportButton = signal(false);
  showTimeFrame = signal(false);
  trimline: Trimline;
  TimeFrameEnum = TimeFrame;

  constructor(private fb: FormBuilder, public homeService: HomeService, private httpClient: HttpClient) {
    this.trimline = new Trimline(this.homeService.serverMap, 5000);

    this.frmGroup = this.fb.group({
      serverGroups: [this.serverGroups],
      report: ['Summary'],
      serverIndex: [-1],
      timeframe: [TimeFrame.Live],
      date: [new Date('8/1/2025'), Validators.required],
      toDate: [new Date(), Validators.required],
      shift: [1],
      fromTime: [
        '12:00 AM',
        [Validators.required, Validators.pattern(/((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/), this.homeService.timeValidator()],
      ],
      toTime: [
        '8:00 PM',
        [Validators.required, Validators.pattern(/((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/), this.homeService.timeValidator()],
      ],
    });

    const frmStr = localStorage.getItem(`${this.moduleID}.frmGroup`);
    if (frmStr) {
      const frm = JSON.parse(frmStr);
      frm.serverGroups = this.serverGroups; // Ensure serverGroups is set correctly incase localstorage has an obsolete value
      this.frmGroup.patchValue(frm);
      this.trimline.updateFilters(frm.serverIndex);
    }
  }

  onFrmGroupChange() {
    if (this.frmGroup.valid) {
      const frm = this.frmGroup.value;
      localStorage.setItem(`${this.moduleID}.frmGroup`, JSON.stringify(frm));
      this.trimline.updateFilters(frm.serverIndex);
      this.trimline.init(frm.timeframe);
      if (this.frmGroup.value.serverIndex === -1) {
        this.frmGroup.patchValue({ serverIndex: this.trimline.servers[0]?.index || 0 }); // Ensure serverIndex is set to a valid server index
      }
    }
  }

  dateChange(date: Date) {
    //make sure toDate is always set to the same date as date when timeframe is Archive
    this.frmGroup.get('toDate')?.setValue(date);
  }

  saveStations(data: StationInterface[]) {
    const host = this.selectedServerHost;
    const stations: StationRootInterface = { stations: data };
    return this.httpClient.post<ErrorResInterface>(`${host}/api/scale/savestations`, stations, this.homeService.httpOptions);
  }

  loadStations() {
    const host = this.selectedServerHost;
    return this.httpClient.get<StationsResInterface>(`${host}/api/scale/loadstations`, this.homeService.httpOptions);
  }

  public get selectedServerHost() {
    const serverIndex = this.frmGroup.get('serverIndex')?.value ?? 0;
    return this.trimline.servers.find((e) => e.index === serverIndex)?.url ?? '';
  }

  onExport() {
    this.homeService.alert.clear();
    const frm = this.frmGroup.value as IFrmGroupHistory;

    const selectedShift = frm.shift === 0 ? 'All Shifts' : 'Shift ' + frm.shift;

    let datetimeframe = '';
    if (frm.timeframe === this.TimeFrameEnum.Live) {
      datetimeframe =
        `Infeed cleared at: ${formatDate(this.trimline.dataSourceServer.data[frm.serverIndex].infeed_cleared * 1000, 'M/d/y h:mm:ss a', 'en-US')}\n` +
        `Outfeed cleared at: ${formatDate(
          this.trimline.dataSourceServer.data[frm.serverIndex].outfeed_cleared * 1000,
          'M/d/y h:mm:ss a',
          'en-US'
        )}\n` +
        `QC cleared at: ${formatDate(this.trimline.dataSourceServer.data[frm.serverIndex].qc_cleared * 1000, 'M/d/y h:mm:ss a', 'en-US')}\n` +
        `Exported at: ${formatDate(new Date(), 'M/dd/yyyy h:mm a', 'en-US')}\n`;
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
    this.exportReportEvent$.next(exportCriteria);
  }
}
