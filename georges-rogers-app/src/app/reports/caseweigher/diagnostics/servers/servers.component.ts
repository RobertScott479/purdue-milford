import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../../../home.service';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AlertComponent } from '../../../../layout/alert/alert.component';

@Component({
  selector: 'app-servers',
  imports: [MatTableModule, DatePipe, MatCardModule, AlertComponent],
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.scss'],
})
export class ServersComponent implements OnInit {
  serverMapFields = ['server', 'url', 'updated', 'status'];

  constructor(public homeService: HomeService) {}
  //TODO: populate the datasourceServerMap and add to diagnostics page
  ngOnInit(): void {}
}
