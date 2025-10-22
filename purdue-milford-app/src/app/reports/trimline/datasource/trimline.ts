import { inject } from '@angular/core';
import { HttpCancelService } from '../../../httpcancel.service';
import { MatTableDataSource } from '@angular/material/table';

import { GrandTotalSummary } from './grand-totals';
import { ServerMap, ServerMapInterface } from '../../../serverMap';

import { TimeFrame } from '../../report.models';
import { formatDate } from '@angular/common';

import { CommInterface, CutterInterface, RegisterInterface, ScaleInterface, ServerInterface } from './trimline.model';
import { IDatasources } from '../../datasource.models';

export class Trimline implements IDatasources {
  constructor(public serverMap: ServerMap, public refreshDelay: number) {
    this.dataSourceCutters.filterPredicate = this.standardfilterPredicate();
    // this.dataSourceComm.filterPredicate = this.standardfilterPredicate();
    // this.dataSourceScale.filterPredicate = this.standardfilterPredicate();
    // this.dataSourceServer.filterPredicate = this.standardfilterPredicate();
    // this.dataSourceRegisters.filterPredicate = this.standardfilterPredicate();
  }

  moduleID = 'trimline';
  serverGroups = ['trimline'];
  servers: ServerMapInterface[] = [];
  tmr: any;
  httpCancelService = inject(HttpCancelService);
  pollingEnabled = false;
  TimeFrameEnum = TimeFrame;
  dataSourceCutters = new MatTableDataSource<CutterInterface>();
  dataSourceComm = new MatTableDataSource<CommInterface>();
  dataSourceScale = new MatTableDataSource<ScaleInterface>();
  dataSourceServer = new MatTableDataSource<ServerInterface>();
  dataSourceRegisters = new MatTableDataSource<RegisterInterface>();
  grandTotals = new GrandTotalSummary();
  lastPoll = '';
  lastCleared = 0;

  init(timeFrame: TimeFrame | null | undefined) {
    //this.servers = this.serverMap.dataSource.data.filter((x) => x.group === this.moduleID && x.enabled === true);
    this.servers = this.serverMap.getServersByGroup(this.serverGroups);

    this.servers.forEach((s) => {
      s.func = () => this.serverMap.fetch(s.index, this.serverMap.getJsonData(s));
    });

    if (timeFrame === this.TimeFrameEnum.Live) {
      this.startRefreshTimer();
    } else {
      this.stopRefreshTimer();
    }
  }

  // private ClearAllDatasources() {
  //   this.grandTotals.reset();
  //   this.dataSourceCutters.data = [];
  //   this.dataSourceComm.data = [];
  //   this.dataSourceScale.data = [];
  //   this.dataSourceServer.data = [];
  //   this.dataSourceRegisters.data = [];
  // }

  private async refresh(delay: number = this.refreshDelay) {
    clearTimeout(this.tmr);
    if (this.pollingEnabled) {
      await this.refreshDatasources();
      this.tmr = setTimeout(() => {
        this.pollingEnabled && this.refresh();
      }, delay);
    }
  }

  async startRefreshTimer(delay: number = this.refreshDelay) {
    if (this.pollingEnabled) return;
    this.pollingEnabled = true;
    this.refresh(delay);
  }

  stopRefreshTimer() {
    this.pollingEnabled = false;
    this.httpCancelService.cancelPendingRequests();
  }

  private addServerName(arr: any[], serverName: string, serverIndex: number) {
    arr.forEach((e) => {
      e.serverName = serverName;
      e.serverIndex = serverIndex;
    });
  }

  getServers(): ServerMapInterface[] {
    return this.servers;
  }

  private async refreshDatasources() {
    clearInterval(this.tmr);

    const commArray = new Array();
    const scaleArray = new Array();
    const serverArray = new Array();
    const cutterArray = new Array();

    const res = await Promise.allSettled(this.servers.map((f) => f.func()));
    res.forEach((r: any) => {
      if (r.status === 'fulfilled' && r.value) {
        const serverName = r.value.server.server;
        const serverIndex = r.value.server.index;
        commArray.push({ ...r.value.response.comm, ...{ serverName: serverName, serverIndex: serverIndex } });
        scaleArray.push({ ...r.value.response.scale, ...{ serverName: serverName, serverIndex: serverIndex } });
        serverArray.push({ ...r.value.response.server, ...{ serverName: serverName, serverIndex: serverIndex } });
        this.addServerName(r.value.response.cutters, serverName, serverIndex);
        cutterArray.push(...r.value.response.cutters);
      }
    });

    this.dataSourceComm.data = commArray;
    this.dataSourceScale.data = scaleArray;
    this.dataSourceServer.data = serverArray;
    cutterArray.forEach((e: CutterInterface) => {
      const totalQCChecks = e.qc_pass_count + e.qc_fail_count;
      e.qc_score = totalQCChecks ? (e.qc_pass_count / totalQCChecks) * 100 : 0;
      e.ppmh = e.work_seconds ? e.out_lbs / (e.work_seconds / 3600) : 0;
      e.hours = e.work_seconds / 3600;
    });

    this.dataSourceCutters.data = cutterArray;
    this.grandTotals.update(this.dataSourceCutters.filteredData);
    //this.httpResponseEvent$.next('data.json');
    const myFormattedDate = formatDate(new Date(), 'M/d/yy, h:mm:ss a', 'en-US');
    this.lastPoll = 'Last poll ' + myFormattedDate;
  }

  private standardfilterPredicate() {
    const myFilterPredicate = (data: any, filterStr: string): boolean => {
      const filter: any = JSON.parse(filterStr);
      const result = data.serverIndex === filter.serverIndex || filter.serverIndex === -1;
      //&& (data.product_code === filter.product_code || filter.product_code === '') &&

      return result;
    };
    return myFilterPredicate;
  }

  updateFilters(serverIndex: number | null | undefined) {
    this.dataSourceCutters.filter = JSON.stringify({
      serverIndex: serverIndex,
    });

    // this.dataSourceComm.filter = JSON.stringify({
    //   serverIndex: serverIndex,
    // });

    // this.dataSourceScale.filter = JSON.stringify({
    //   serverIndex: serverIndex,
    // });

    // this.dataSourceServer.filter = JSON.stringify({
    //   serverIndex: serverIndex,
    // });

    // this.dataSourceRegisters.filter = JSON.stringify({
    //   serverIndex: serverIndex,
    // });

    this.grandTotals.update(this.dataSourceCutters.filteredData);
  }
}
