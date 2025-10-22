import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { MatSort } from '@angular/material/sort';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';

import { CommonModule, DatePipe } from '@angular/common';
import { HomeService } from '../../../home.service';

import { CommCountersComponent } from './comm-counters/comm-counters.component';
import { ModbusComponent } from './modbus/modbus.component';
import { ModbusTcpMapComponent } from './modbus-tcp-map/modbus-tcp-map.component';
import { ScaleHealthComponent } from './scale-health/scale-health.component';
import { ScaleInfoComponent } from './scale-info/scale-info.component';
import { ServerInfoComponent } from './server-info/server-info.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { CaseweigherService } from '../datasource/caseweigher.service';
import { TimeFrame } from '../../report.models';
import { CommInterface, ScaleInterface, ServerInterface } from './diagnostics.model';

@Component({
  selector: 'app-caseweigher-diagnostics',
  standalone: true,
  imports: [
    MatTableModule,
    MatExpansionModule,
    CommonModule,
    CommCountersComponent,
    // ScaleHealthComponent,
    // ScaleInfoComponent,
    // ServerInfoComponent,
    //AlertComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    ReactiveFormsModule,
    ScaleInfoComponent,
    ServerInfoComponent,
  ],
  templateUrl: './diagnostics.component.html',
  styleUrls: ['./diagnostics.component.scss'],
})
export class CaseweigherDiagnosticsComponent implements OnInit, AfterViewInit {
  constructor(public homeService: HomeService, public caseweigherService: CaseweigherService) {}
  // @ViewChild(MatSort) sort: MatSort;
  timeFramelast = TimeFrame.Live;
  ngOnInit(): void {
    // this.caseweigherService.dataSourceComm.filterPredicate = this.commFilterPredicate();
    // this.caseweigherService.dataSourceScale.filterPredicate = this.scaleFilterPredicate();
    // this.caseweigherService.dataSourceServer.filterPredicate = this.serverFilterPredicate();
    this.timeFramelast = this.caseweigherService.frmGroup.get('timeframe')?.value ?? TimeFrame.Live;
    this.caseweigherService.frmGroup.get('timeframe')?.setValue(TimeFrame.Live);
    this.caseweigherService.onFrmGroupChange();
  }
  ngOnDestroy(): void {
    this.caseweigherService.frmGroup.get('timeframe')?.setValue(this.timeFramelast);
    //this.caseweigherService.onFrmGroupChange();
  }

  // onFrmGroupChange() {
  //   if (this.caseweigherService.frmGroup.valid) {
  //     const frm = this.caseweigherService.frmGroup.value;
  //     localStorage.setItem('frmGroupHistory', JSON.stringify(frm));
  //     this.caseweigherService.updateFilters(frm.serverIndex);
  //     this.caseweigherService.init(frm.timeframe);
  //   }
  // }

  ngAfterViewInit(): void {}

  commFilterPredicate() {
    const myFilterPredicate = (data: CommInterface, filter: string): boolean => {
      const searchString = JSON.parse(filter);
      const lineFound = data.serverIndex === searchString.serverIndex || searchString.serverIndex === -1;
      return lineFound;
    };
    return myFilterPredicate;
  }

  scaleFilterPredicate() {
    const myFilterPredicate = (data: ScaleInterface, filter: string): boolean => {
      const searchString = JSON.parse(filter);
      const lineFound = data.serverIndex === searchString.serverIndex || searchString.serverIndex === -1;
      return lineFound;
    };
    return myFilterPredicate;
  }

  serverFilterPredicate() {
    const myFilterPredicate = (data: ServerInterface, filter: string): boolean => {
      const searchString = JSON.parse(filter);
      const lineFound = data.serverIndex === searchString.serverIndex || searchString.serverIndex === -1;
      return lineFound;
    };
    return myFilterPredicate;
  }
}
