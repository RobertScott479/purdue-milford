import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { HomeService } from '../../../../home.service';
import { CaseweigherService } from '../../datasource/caseweigher.service';

@Component({
  selector: 'app-modbus-tcp-map',
  standalone: true,
  imports: [MatTableModule, MatExpansionModule],
  templateUrl: './modbus-tcp-map.component.html',
  styleUrls: ['./modbus-tcp-map.component.scss'],
})
export class ModbusTcpMapComponent implements OnInit {
  displayedColumnsRegisters = ['offset', 'registers', 'type', 'bits', 'read_write', 'path', 'description', 'contents', 'value'];

  constructor(public caseweigherService: CaseweigherService) {}

  ngOnInit(): void {}
}
