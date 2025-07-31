import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { HomeService } from '../../../../home.service';
import { CommonModule, DatePipe } from '@angular/common';
import { okFailed, yesNoPipe, elapsedTime } from '../../../../pipes.pipe';

import { FloorscaleService } from '../../datasource/floorscale.service';

@Component({
  selector: 'app-floorscale-scale-info',
  standalone: true,
  imports: [MatTableModule, MatExpansionModule, DatePipe, CommonModule, elapsedTime],
  templateUrl: './scale-info.component.html',
  styleUrls: ['./scale-info.component.scss', '../../../../../styles/table.scss'],
})
export class ScaleInfoComponent implements OnInit {
  gridColumnsScaleInfo = ['serverName', 'app', 'boot', 'cleared', 'silicon_serial_number', 'scale_uptime', 'build_time', 'firmware'];
  constructor(public floorscaleService: FloorscaleService, public homeService: HomeService) {}

  ngOnInit(): void {}
}
