import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { HomeService } from '../../../../home.service';
import { DatePipe } from '@angular/common';
import { CaseweigherService } from '../../datasource/caseweigher.service';

@Component({
  selector: 'app-comm-counters',
  standalone: true,
  imports: [MatTableModule, MatExpansionModule, DatePipe],
  templateUrl: './comm-counters.component.html',
  styleUrls: ['./comm-counters.component.scss', '../../../../../styles/table.scss'],
})
export class CommCountersComponent implements OnInit {
  gridColumnCommCounters = ['serverName', 'tx', 'rx', 'out', 'in', 'crc', 'timeout', 'reply'];
  constructor(public caseweigherService: CaseweigherService) {}

  ngOnInit(): void {}
}
