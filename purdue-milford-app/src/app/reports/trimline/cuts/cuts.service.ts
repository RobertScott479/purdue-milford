import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { CutsResInterface, ICutInfo } from './cuts.model';
import { ErrorResInterface } from '../../../models';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { TrimlineService } from '../datasource/trimline.service';
import { FormBuilder } from '@angular/forms';
import { delay } from 'rxjs/internal/operators/delay';
import { timeout } from 'rxjs/internal/operators/timeout';
import { AlertMessage } from '../../../layout/alert/alert-message';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CutsService {
  alert = new AlertMessage();

  selectedCutCode = '';

  cutClipboard: ICutInfo = {} as ICutInfo;
  dataSourceCutInfo = new MatTableDataSource<ICutInfo>();

  constructor(public httpClient: HttpClient, public dialog: MatDialog, public trimlineService: TrimlineService, public fb: FormBuilder) {}

  saveCutsAsync(data: ICutInfo[]) {
    const host = this.trimlineService.selectedServerHost;
    return firstValueFrom(
      this.httpClient
        .post<ErrorResInterface>(`${host}/api/products/saveCuts`, data, this.trimlineService.homeService.httpOptions)
        .pipe(timeout(this.trimlineService.homeService.timeoutDelay))
        .pipe(delay(0))
    );
  }

  loadCutsAsync(url: string = this.trimlineService.selectedServerHost): Promise<CutsResInterface> {
    return firstValueFrom(
      this.httpClient
        .get<CutsResInterface>(`${url}/api/products/loadcuts`)
        .pipe(delay(0))
        .pipe(timeout(this.trimlineService.homeService.timeoutDelay))
    );
  }

  async loadCutsAsync1() {
    try {
      this.alert.clear();
      const res = await this.loadCutsAsync();
      this.dataSourceCutInfo.data = res.cuts;
      // console.log(this.dataSourceCutInfo.data);
    } catch (err) {
      this.dataSourceCutInfo.data = [];
      this.alert.setError('Unable to load product cuts. ' + this.alert.getErrorMessage(err));
    } finally {
      return this.alert.message;
    }
  }
}
