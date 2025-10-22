import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { HomeService } from '../../../../home.service';

@Component({
  selector: 'app-modbus',
  standalone: true,
  imports: [MatTableModule, MatExpansionModule],
  templateUrl: './modbus.component.html',
  styleUrls: ['./modbus.component.scss'],
})
export class ModbusComponent implements OnInit {
  modbusFields = ['scale', 'clients', 'connections', 'disconnections', 'missed_trays', 'reads', 'short_reads', 'writes'];
  constructor(public homeService: HomeService) {}

  ngOnInit(): void {}
}
