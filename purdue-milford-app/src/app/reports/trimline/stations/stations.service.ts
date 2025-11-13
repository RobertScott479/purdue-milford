import { Injectable, signal } from '@angular/core';
import { AlertMessage } from '../../../layout/alert/alert-message';
import { MatTableDataSource } from '@angular/material/table';
import { StationInterface, StationRootInterface, StationsResInterface } from '../datasource/trimline.model';
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
  name?: string;
  station: string;
  punchIn: number;
  punchOut: number;
  //notes: string;
  updateBy: string;
  updateAt?: number;
}

export interface IPunchesResponse {
  errorCode: string;
  errorMessage: string;
  punches: IPunch[];
}

@Injectable({
  providedIn: 'root',
})
export class StationsService {
  alert = new AlertMessage();
  duplicateCutterNumber = new Map<number, string[]>();
  datasource = new MatTableDataSource<StationInterface>();
  datasourcePunches = new MatTableDataSource<IPunch>();
  showSpinner = signal(false);
  timeoutDelay = 6000;
  submitted = signal(false);
  dirty = false;
  serverList: ServerMapInterface[] = [];
  stationList: StationInterface[] = [];
  stationNames: string[] = [];

  constructor(public trimlineService: TrimlineService, private httpClient: HttpClient, public homeService: HomeService) {
    this.datasource.filterPredicate = this.filterPredicate();
    this.serverList = this.homeService.serverMap.getServersByGroup(['trimline']);
    this.stationNames = this.initStations(0).map((s) => s.station);
  }

  saveStations(data: StationInterface[]) {
    const host = this.trimlineService.selectedServerHost;
    const stations: StationRootInterface = { stations: data };
    return this.httpClient.post<ErrorResInterface>(`${host}/api/scale/savestations`, stations, this.trimlineService.homeService.httpOptions);
  }

  async onSave() {
    this.alert.clear();

    this.showSpinner.set(true);
    this.alert.setLight('Saving stations...');
    const serverIndex = this.trimlineService.frmGroup.get('serverIndex')?.value ?? -1;
    try {
      this.trimlineService.blinkIndicator(serverIndex, 'unknown');
      const host = this.trimlineService.selectedServerHost;
      const stations: StationRootInterface = { stations: this.datasource.data };
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
        this.alert.clear();
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

    this.duplicateCutterNumber.clear();
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

        this.datasource.data = res.stations.map((station) => {
          const s = {
            ...station,
            primaryCutterName: station.name,
          };

          return s;
        });

        this.alert.clear();
        const warningMessage: string[] = [];
        this.duplicateCutterNumber.forEach((value, key) => {
          if (value.length > 1 && key !== 0) {
            warningMessage.push(`Cutter: ${key}, Assigned To: ${value.join(', ')}`);
          }
        });

        if (warningMessage.length > 0) {
          this.homeService.showAlert('Warning', 'Duplicate Cutter Assignments Detected:\n' + warningMessage.join('\n'));
        }
      } else {
        this.datasource.data = [];
        this.alert.setError(res.errorMessage);
      }
    } catch (err) {
      this.trimlineService.blinkIndicator(serverIndex, 'offline');
      this.alert.setError(err);
    }

    this.showSpinner.set(false);
    //this.defaultStations();
  }

  private filterPredicate() {
    const myFilterPredicate = (data: any, filterStr: string): boolean => {
      const filter: any = JSON.parse(filterStr);
      const result = data.shift === filter.shift || filter.shift === 0;
      //&& (data.product_code === filter.product_code || filter.product_code === '') &&

      return result;
    };
    return myFilterPredicate;
  }

  async loadPunches(date: Date, shift: number) {
    const productionDate = this.homeService.getUnixTimestampDateOnly(date);
    const host = this.homeService.serverMap.getServersByGroup(['dbserver'])[0]?.url ?? '';
    const endpoint = `${host}/api/punches/load/${productionDate}/${shift}`;

    try {
      const res = await firstValueFrom(this.httpClient.get<IPunchesResponse>(endpoint, this.homeService.httpOptions));

      if (res.errorCode === '0') {
        this.datasourcePunches.data = res.punches;
      } else {
        console.error('Error loading punches:', res.errorMessage);
        this.datasource.data = [];
      }
    } catch (error) {
      console.error('Error loading punches:', error);
      this.datasource.data = [];
    } finally {
    }
  }

  initStations(shift: number): StationInterface[] {
    const stationList: StationInterface[] = [];
    const lines = ['A', 'B'];
    lines.forEach((l) => {
      for (let i = 1; i <= 12; i++) {
        const stationName = `${l}${i.toString().padStart(2, '0')}`;
        stationList.push({
          station: stationName,
          enabled: true,
          cutter_number: 0,
          name: '',
          shift: shift,
        });
      }
    });
    return stationList;
  }

  initStationList(): StationInterface[] {
    const stationList: StationInterface[] = [];
    stationList.push(...this.initStations(1));
    stationList.push(...this.initStations(2));
    return stationList;
  }
}
