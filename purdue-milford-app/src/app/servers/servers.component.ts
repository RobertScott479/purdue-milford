import { Component, OnInit } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AlertComponent } from '../layout/alert/alert.component';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-servers',
  imports: [MatTableModule, DatePipe, MatCardModule, AlertComponent, MatSlideToggleModule],
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.scss', '../../styles/table.scss'],
})
export class ServersComponent implements OnInit {
  serverMapFields = ['enabled', 'server', 'url', 'updated', 'status'];

  constructor(public homeService: HomeService) {}
  //TODO: populate the datasourceServerMap and add to diagnostics page
  ngOnInit(): void {}

  toggleChange(index: number) {
    const server = this.homeService.serverMap.dataSource.data.find((s) => s.index === index);
    if (server) {
      server.enabled = !server.enabled;
    }
  }
}
