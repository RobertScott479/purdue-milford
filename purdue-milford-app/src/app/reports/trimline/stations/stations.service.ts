import { Injectable, signal } from '@angular/core';
import { AlertMessage } from '../../../layout/alert/alert-message';
import { MatTableDataSource } from '@angular/material/table';

import { TrimlineService } from '../datasource/trimline.service';
import { delay, firstValueFrom, timeout } from 'rxjs';
import { ErrorResInterface } from '../../../models';
import { HttpClient } from '@angular/common/http';
import { HomeService } from '../../../home.service';
import { ServerMapInterface } from '../../../serverMap';

export interface IPunch {
  id?: number;
  productionDate: number;
  shift: number;
  cutter_number: number;
  cutternName?: string;
  station: string;
  punchIn: number;
  punchOut: number;
  updatedBy: string;
  updatedAt?: number;
  deleted: number;
}

export interface IPunchesResponse {
  errorCode: string;
  errorMessage: string;
  punches: IPunch[];
}

export interface StationRootInterface {
  stations: StationInterface[];
}

export interface StationsResInterface extends ErrorResInterface {
  stations: StationInterface[];
}

export interface StationInterface {
  station: string;
  enabled: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class StationsService {
  alert = new AlertMessage();
  datasourceStations = new MatTableDataSource<StationInterface>();
  datasourcePunches = new MatTableDataSource<IPunch>();

  showSpinner = signal(false);
  timeoutDelay = 6000;
  submitted = signal(false);
  dirty = false;

  stationList: StationInterface[] = [];
  stationNames: string[] = [];

  constructor(public trimlineService: TrimlineService, private httpClient: HttpClient, public homeService: HomeService) {
    this.stationNames = this.initStations().map((s) => s.station);
  }

  saveStations(data: StationInterface[]) {
    const host = this.trimlineService.selectedServerHost;
    const stations: StationRootInterface = { stations: data };
    return this.httpClient.post<ErrorResInterface>(`${host}/api/scale/savestations`, stations, this.trimlineService.homeService.httpOptions);
  }

  async onSaveStations() {
    this.alert.clear();

    this.showSpinner.set(true);
    this.alert.setLight('Saving stations...');
    const serverIndex = this.trimlineService.frmGroup.get('serverIndex')?.value ?? -1;
    try {
      this.trimlineService.blinkIndicator(serverIndex, 'unknown');
      const host = this.trimlineService.selectedServerHost;
      const stations: StationRootInterface = { stations: this.datasourceStations.data };
      const res = await firstValueFrom(
        this.httpClient
          .post<ErrorResInterface>(`${host}/api/scale/savestations`, stations, this.trimlineService.homeService.httpOptions)
          .pipe(timeout(this.timeoutDelay))
          .pipe(delay(1000))
      );
      this.trimlineService.blinkIndicator(serverIndex, 'online');
      if (res.errorCode === '0') {
        this.submitted.set(true);
        this.trimlineService.frmGroup.get('serverIndex')?.enable();

        await this.loadStations();
        this.alert.setSuccess('Stations saved');
        await this.homeService.delay(500);

        this.dirty = false;
      } else {
        this.alert.setError(res.errorMessage);
      }
    } catch (err) {
      this.trimlineService.blinkIndicator(serverIndex, 'offline');
      this.alert.setError(err);
    }

    this.showSpinner.set(false);
  }

  async loadStations() {
    this.submitted.set(false);
    this.showSpinner.set(true);

    const serverIndex = this.trimlineService.frmGroup.get('serverIndex')?.value ?? -1;
    try {
      this.trimlineService.blinkIndicator(serverIndex, 'unknown');
      const host = this.trimlineService.selectedServerHost;

      const res = await firstValueFrom(
        this.httpClient
          .get<StationsResInterface>(`${host}/api/scale/loadstations`, this.trimlineService.homeService.httpOptions)
          .pipe(timeout(this.timeoutDelay))
          .pipe(delay(0))
      );
      this.trimlineService.blinkIndicator(serverIndex, 'online');
      if (res.errorCode === '0') {
        this.dirty = false;
        this.submitted.set(true);
        this.trimlineService.frmGroup.get('serverIndex')?.enable();

        if (res.stations.length === 0) {
          this.datasourceStations.data = this.initStations();
        } else {
          this.datasourceStations.data = res.stations;
        }
        this.alert.setInfo('Toggle stations On or Off');
      } else {
        this.datasourceStations.data = [];
        this.alert.setError(res.errorMessage);
      }
    } catch (err) {
      this.trimlineService.blinkIndicator(serverIndex, 'offline');
      this.alert.setError(err);
    }

    this.showSpinner.set(false);
  }

  initStations(): StationInterface[] {
    const stationList: StationInterface[] = [];
    const lines = ['A', 'B'];
    lines.forEach((l) => {
      for (let i = 1; i <= 12; i++) {
        const stationName = `${l}${i.toString().padStart(2, '0')}`;
        stationList.push({
          station: stationName,
          enabled: true,
        });
      }
    });
    return stationList;
  }

  // initStationList(): StationInterface[] {
  //   const stationList: StationInterface[] = [];
  //   stationList.push(...this.initStations(1));
  //   stationList.push(...this.initStations(2));
  //   return stationList;
  // }

  async loadPunches(startUnix: number, stopUnix: number) {
    //const productionDate = this.homeService.getUnixTimestampDateOnly(date);
    const host = this.homeService.serverMap.getServersByGroup(['dbserver'])[0]?.url ?? '';
    const endpoint = `${host}/api/punches/loadpunches?start=${startUnix}&stop=${stopUnix}`;

    try {
      const res = await firstValueFrom(this.httpClient.get<IPunchesResponse>(endpoint, this.homeService.httpOptions));

      if (res.errorCode === '0') {
        this.datasourcePunches.data = res.punches;
      } else {
        console.error('Error loading punches:', res.errorMessage);
        this.datasourcePunches.data = [];
      }
    } catch (error) {
      console.error('Error loading punches:', error);
      this.datasourcePunches.data = [];
    } finally {
    }
  }
}
