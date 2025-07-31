import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Router, RouterLink } from '@angular/router';

import { MatExpansionModule } from '@angular/material/expansion';
import { HomeService } from '../../../home.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableModule,
} from '@angular/material/table';
import { AlertComponent } from '../../../layout/alert/alert.component';
import { DatePipe, NgIf } from '@angular/common';
import { okFailed, elapsedTime, yesNoPipe } from '../../../pipes.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TimeFrame } from '../../report.models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

import { TrimlineService } from '../datasource/trimline.service';

@Component({
  selector: 'app-trimline-diagnostics',
  templateUrl: './diagnostics.component.html',
  styleUrls: ['./diagnostics.component.scss', '../../../../styles/table.scss'],
  standalone: true,
  imports: [
    MatExpansionModule,
    //okFailed,
    //PipesPipe,
    //yesNoPipe,
    DatePipe,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
})
export class DiagnosticsComponent implements OnInit {
  //frmGroupHistorySubscription = new Subscription();
  tmr: any;

  displayedColumnsComm = ['serverName', 'tx', 'rx', 'out', 'in', 'crc', 'timeout', 'reply', 'latency', 'delay'];

  displayedColumnsServer = ['serverName', 'dev', 'uptime', 'poll', 'cpu_temp'];
  displayedColumnsServerExt = ['serverName', 'app', 'serial_number', 'bios_info'];
  displayedColumnsServerExt2 = ['serverName', 'infeed_cleared', 'infeed_updated', 'outfeed_cleared', 'outfeed_updated', 'qc_cleared', 'qc_updated'];

  displayedColumnsScale = ['serverName', 'app', 'boot', 'silicon_serial_number', 'operating_mode'];
  displayedColumnsScaleHealth = [
    'serverName',
    'health_coin_cell_ok',
    'health_nvram_defaulted',
    'health_nvram_reloaded',
    'health_rtc_running',
    'health_rtc_sane',
  ];
  displayedColumnsRegisters = ['serverName', 'offset', 'registers', 'type', 'bits', 'read_write', 'description', 'contents', 'value'];

  constructor(public homeService: HomeService, public trimlineService: TrimlineService) {
    this.trimlineService.showExportButton.set(false);
    this.trimlineService.trimline.init(TimeFrame.Live);
  }
  //@ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    // this.trimlineService.frmGroup.get('timeframe')?.setValue(TimeFrame.Live);
    // this.trimlineService.frmGroup.get('timeframe')?.disable();
    this.onFrmGroupChange();
  }

  ngOnDestroy(): void {
    //this.trimlineService.frmGroup.get('timeframe')?.enable();
  }

  onFrmGroupChange() {
    if (this.trimlineService.frmGroup.valid) {
      const frm = this.trimlineService.frmGroup.value;
      localStorage.setItem('trimline.frmGroup', JSON.stringify(frm));
      this.trimlineService.trimline.updateFilters(frm.serverIndex);
      this.trimlineService.trimline.init(frm.timeframe);
    }
  }
}
