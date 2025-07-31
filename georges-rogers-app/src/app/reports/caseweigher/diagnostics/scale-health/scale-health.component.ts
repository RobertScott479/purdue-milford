import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { HomeService } from '../../../../home.service';
import { okFailed, yesNoPipe } from '../../../../pipes.pipe';
import { CaseweigherService } from '../../datasource/caseweigher.service';

@Component({
  selector: 'app-scale-health',
  standalone: true,
  imports: [MatTableModule, MatExpansionModule, yesNoPipe, okFailed],
  templateUrl: './scale-health.component.html',
  styleUrls: ['./scale-health.component.scss'],
})
export class ScaleHealthComponent implements OnInit {
  gridColumnsScaleHealth = [
    'server',
    'health_coin_cell_ok',
    'health_nvram_defaulted',
    'health_nvram_reloaded',
    'health_rtc_running',
    'health_rtc_sane',
  ];

  constructor(public caseweigherService: CaseweigherService) {}

  ngOnInit(): void {}
}
