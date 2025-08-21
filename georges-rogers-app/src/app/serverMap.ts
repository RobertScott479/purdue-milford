import { MatTableDataSource } from '@angular/material/table';

import { inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { delay, timeout } from 'rxjs/operators';
import { ConfirmationDialogInterface } from './layout/confirmation-dialog/confirmation.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './layout/confirmation-dialog/confirmation-dialog.component';
import { TimeFrame } from './reports/report.models';
import { formatDate } from '@angular/common';

export interface IShiftTime {
  hour: number;
  minute: number;
  offset: number;
}

export interface IShift {
  name: string;
  start: IShiftTime;
  stop: IShiftTime;
}

export interface ServerMapInterface {
  server: string;
  url: string;
  status?: string;
  updated?: number;
  group: string;
  enabled?: boolean;
  state?: 'online' | 'offline' | 'unknown' | 'disabled';
  failures?: number;
  attempts?: number;
  index: number;
  cleared: string;
  func: () => Promise<IResponseWithServerInfo | null>;
}

export interface IAppConfig {
  serverMap: ServerMapInterface[];
  serverMapDemo: ServerMapInterface[];
  appTitle: string;
  hasModbus: boolean;
  shifts: IShift[];
}

export interface IResponseWithServerInfo {
  server: ServerMapInterface;
  response: any;
}

export class ServerMap {
  constructor(private serverMapUrl: string) {}
  dialog = inject(MatDialog);
  appConfig: IAppConfig = { serverMap: [], serverMapDemo: [], appTitle: '', hasModbus: false, shifts: [] };
  serverMapMode: 'production' | 'demo' | '' = '';

  servermapLoaded = signal(false);
  dataSource = new MatTableDataSource<ServerMapInterface>();
  httpClient = inject(HttpClient);
  timeoutDelay = 20000;
  startUnix = 0;
  stopUnix = 0;

  httpStatusCodes: { [key: number]: string } = {
    100: 'Continue',
    101: 'Switching Protocols',
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    307: 'Temporary Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: '', //File Not Found
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Request Entity Too Large',
    414: 'Request-URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Requested Range Not Satisfiable',
    417: 'Expectation Failed',
    500: 'Server did not responsed. Server may be offline or unreachable',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported',
  };

  errorGetMessage(err: any): string {
    let errorMessage = '';
    if (err instanceof HttpErrorResponse) {
      if (err.status >= 100 && err.status < 200) {
        errorMessage = '';
      } else if (err.status >= 200 && err.status < 300) {
        errorMessage = '';
      } else if (err.status >= 400 && err.status < 500) {
        errorMessage = this.httpStatusCodes[err.status];
      } else if (err.status >= 500) {
        errorMessage = this.httpStatusCodes[err.status];
      } else if (err.status === 0) {
        errorMessage = 'Server did not responsed, Server may be offline or unreachable';
      } else {
        errorMessage = err.message;
      }
    } else if (err instanceof Error) {
      if (err.name === 'TimeoutError') {
        errorMessage = 'Server did not responsed.  Server may be offline or unreachable';
      } else {
        errorMessage = err.message;
      }
    } else {
      errorMessage = err;
    }
    return errorMessage;
  }

  async fetch(serverIndex: number, url = ''): Promise<IResponseWithServerInfo | null> {
    //console.log('fetch started', serverIndex, url);
    if (url === '') {
      url = this.dataSource.data[serverIndex].url;
    }
    const serverName = this.dataSource.data[serverIndex].server;
    const d = new Date();

    if (!this.dataSource.data[serverIndex].enabled) return null;
    try {
      this.dataSource.data[serverIndex].attempts = (this.dataSource.data[serverIndex].attempts ?? 0) + 1; //increment attempts count
      this.dataSource.data[serverIndex].status = 'Requesting data...';
      // console.log('Request started', serverIndex);
      const res = await this.httpClient.get(url).pipe(timeout(this.timeoutDelay)).pipe(delay(500)).toPromise();
      if (!res) {
        // console.log('Request canceled', serverIndex);
        this.dataSource.data[serverIndex].status = 'Request Canceled.';
        this.dataSource.data[serverIndex].attempts--;
        return null; //http request cancelled
      }
      this.dataSource.data[serverIndex].index = serverIndex;
      this.dataSource.data[serverIndex].status = 'Data received.';
      this.dataSource.data[serverIndex].updated = d.getTime();
      this.dataSource.data[serverIndex].state = 'online';
      this.dataSource.data[serverIndex].failures = 0;
      // console.log('Request completed', serverIndex);
      const response: IResponseWithServerInfo = { server: this.dataSource.data[serverIndex], response: res };
      return response;
    } catch (err: any) {
      // console.log('Request error', serverIndex);
      const errMsg = this.errorGetMessage(err);
      if (!(err?.status === 404 && url?.includes('/data.json'))) {
        this.dataSource.data[serverIndex].status = errMsg;
        this.dataSource.data[serverIndex].failures = (this.dataSource.data[serverIndex].failures ?? 0) + 1; //increment failure count
        if (this.dataSource.data[serverIndex].failures > 6 && this.dataSource.data[serverIndex].state !== 'disabled') {
          this.dataSource.data[serverIndex].state = 'offline';
        }
        throw new Error(errMsg);
      }
      this.dataSource.data[serverIndex].updated = d.getTime();
      return null;
    }
  }

  async loadServerMap(mode: 'production' | 'demo') {
    if (this.serverMapMode) {
      //   console.log('ServerMap already loaded as', this.serverMapMode);
      return;
    }
    // this.serverMapMode = mode;
    this.serverMapMode = 'demo'; //remove me for production.

    const res = await this.httpClient.get<IAppConfig>(this.serverMapUrl).toPromise();
    if (!res) {
      throw new Error('ServerMap not loaded');
    }
    this.appConfig = res;

    if (mode === 'production') {
      this.dataSource.data = this.appConfig.serverMap;
    } else {
      this.dataSource.data = this.appConfig.serverMapDemo;
    }

    this.dataSource.data.forEach((server, index) => {
      server.enabled = true;
      server.state = 'unknown';
      server.index = index;
      server.cleared = '';
      // const url = this.getJsonData(server);
      // server.func = () => this.fetch(index, url);
    });

    this.servermapLoaded.set(true);
  }

  getJsonData(server: ServerMapInterface): string {
    //const jsonFilename = this.serverMapMode === 'demo' ? server.group : 'data';
    const jsonFilename = server.group;
    const datajson = `/assets/${jsonFilename}.json`;
    const filename = this.getServerHost(server).url + datajson;
    return filename;
  }

  getServerHost(server: ServerMapInterface) {
    const svr = Object.assign({}, server);
    const matches = server.url.match(/((http|https):\/\/)\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?::\d{0,4})?\b/);
    //const matches = server.url.match(/^(https?:\/\/)((\d{1,3}\.){3}\d{1,3}|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d{1,5})?\/?$/);
    svr.url = matches ? matches[0] : '';
    return svr;
  }

  getServerFile(server: ServerMapInterface) {
    const svr = Object.assign({}, server);
    svr.url = server.url ?? '';
    return svr;
  }

  async fetchDb2(frm: any) {
    const responsePayload = new Array<IResponseWithServerInfo>();
    const servers: any[] = [];

    for (const s of this.getServersByGroup(frm.serverGroups)) {
      s.state = 'unknown';
      if (s.enabled) {
        const url = s.url + this.getFileFromDateAndShift(frm, s.group); //specifying a json file is only useful for testing api json response without having a working endpoint.  only works when timeframe is live.
        servers.push(() => this.fetch(s.index, url));
      }
    }
    const res = (await Promise.allSettled(servers.map((f) => f()))) as Array<PromiseFulfilledResult<IResponseWithServerInfo | null>>;

    let serversResponding = 0;
    res.forEach((r: PromiseFulfilledResult<IResponseWithServerInfo | null>) => {
      if (r.status === 'fulfilled' && r.value) {
        serversResponding++;
        const serverName = r.value.server.server;
        const serverIndex = r.value.server.index;
        //const serverGroup = r.value.server.group;

        r?.value?.response[frm.report.replace('Histogram', 'details').toLowerCase()].forEach((e: any) => {
          e.updated = new Date().getTime() / 1000;
          e.serverName = serverName;
          e.serverIndex = serverIndex;
          //e.serverGroup = serverGroup;
        });
        r.value && responsePayload.push(r.value);
      }
    });

    if (serversResponding !== servers.length) {
      await this.showServerOfflineWarning();
    }

    return responsePayload;
  }

  async showServerOfflineWarning() {
    const dialogData: ConfirmationDialogInterface = {
      title: 'Server unreachable',
      content: 'Please verify the server(s) are online and connections are good.',
      yesButton: 'OK',
      noButton: '',
      returnVal: undefined,
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: dialogData,
    });

    const response = await dialogRef.afterClosed().toPromise();
    if (response === 'Yes') {
      return true;
    } else {
      return false;
    }
  }

  getFileFromDateAndShift(frm: any, selectedGroup: string): string {
    const selectedReport = frm.report.toLowerCase();
    let endpoint = ``;
    if (frm.timeframe === TimeFrame.Live) {
      const jsondataFilename = `${selectedGroup}_${selectedReport}.json`;
      endpoint = `/assets/${jsondataFilename ?? 'data.json'}`;
    } else if (frm.timeframe === TimeFrame.Archive) {
      const dateString = formatDate(frm.date, 'yyyy-MM-dd', 'en-US');
      const dateShift = `${dateString}-${frm.shift}`;
      endpoint = `/archive/${dateShift}-data.json`;
    } else if (frm.timeframe === TimeFrame.DateShift) {
      const shifts = this.appConfig.shifts;

      const dateStart = new Date(frm.date);
      dateStart.setDate(dateStart.getDate() + shifts[frm.shift - 1].start.offset);
      dateStart.setHours(shifts[frm.shift - 1].start.hour, shifts[frm.shift - 1].start.minute, 0, 0);

      const dateStop = new Date(frm.date);
      dateStop.setDate(dateStop.getDate() + shifts[frm.shift - 1].stop.offset);
      dateStop.setHours(shifts[frm.shift - 1].stop.hour, shifts[frm.shift - 1].stop.minute, 0, 0);

      this.startUnix = Math.floor(dateStart.getTime() / 1000);
      this.stopUnix = Math.floor(dateStop.getTime() / 1000);

      if (['summary', 'details', 'histogram', 'rate'].includes(selectedReport)) {
        endpoint = `/api/${selectedGroup}/${selectedReport.replace('histogram', 'details')}?start=${this.startUnix}&stop=${this.stopUnix}`;
      }
    } else if (frm.timeframe === TimeFrame.Custom) {
      const startDTStr = formatDate(frm.date, 'MM/dd/yyyy ', 'en-US') + frm.fromTime.toLowerCase();
      const stopDTStr = formatDate(frm.toDate, 'MM/dd/yyyy ', 'en-US') + frm.toTime.toLowerCase();

      const startDT = new Date(startDTStr);
      const stopDT = new Date(stopDTStr);
      this.startUnix = Math.floor(startDT.getTime() / 1000);
      this.stopUnix = Math.floor(stopDT.getTime() / 1000);
      if (['summary', 'details', 'histogram', 'rate'].includes(selectedReport)) {
        endpoint = `/api/${selectedGroup}/${selectedReport.replace('histogram', 'details')}?start=${this.startUnix}&stop=${this.stopUnix}`;
      }
    }
    return endpoint;
  }

  // Returns a list of enabled servers filtered by the provided server groups
  // if serverGroups includes one of the serverMap.group then the server.group is set to the group matched in serverGroup
  getServersByGroup(serverGroups: string[]): ServerMapInterface[] {
    const serverCopy = JSON.parse(JSON.stringify(this.dataSource.data));

    const servers = serverCopy.filter((x: ServerMapInterface) => {
      let foundIt = false;

      if (x.enabled) {
        const groups = x.group.split(',') ?? [];
        groups.forEach((g: string) => {
          serverGroups.forEach((sg: string) => {
            if (sg === g) {
              x.group = sg; // say, if x.group = 'sizer,xyz,fillets' and serverGroups = ['tenders','fillets','etc'] then x.group will be set to 'fillets' as it matches both groups.
              foundIt = true;
            }
          });
        });
        return foundIt;
      }
      return foundIt;
    });
    return servers;
  }
}
