import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { HomeService } from '../../../../home.service';
import { CommonModule, DatePipe } from '@angular/common';
import { okFailed, yesNoPipe, elapsedTime } from '../../../../pipes.pipe';

@Component({
  selector: 'app-server-info',
  standalone: true,
  imports: [MatTableModule, MatExpansionModule, CommonModule],
  templateUrl: './server-info.component.html',
  styleUrls: ['./server-info.component.scss'],
})
export class ServerInfoComponent implements OnInit {
  displayedColumnsServer = ['server', 'dev', 'uptime', 'poll'];

  displayedColumnsServerExt = ['server', 'app', 'serial_number', 'bios_info'];

  constructor(public homeService: HomeService) {}

  ngOnInit(): void {}
}
