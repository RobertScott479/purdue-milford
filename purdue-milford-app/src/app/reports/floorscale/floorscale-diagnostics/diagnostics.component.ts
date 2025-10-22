import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';

import { CommonModule, DatePipe } from '@angular/common';
import { HomeService } from '../../../home.service';

import { CommCountersComponent } from './comm-counters/comm-counters.component';

import { AlertComponent } from '../../../layout/alert/alert.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';

import { FloorscaleService } from '../datasource/floorscale.service';

import { ScaleInfoComponent } from './scale-info/scale-info.component';

@Component({
  selector: 'app-floorscale-diagnostics',
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
  ],
  templateUrl: './diagnostics.component.html',
  styleUrls: ['./diagnostics.component.scss'],
})
export class floorscaleDiagnosticsComponent implements OnInit {
  constructor(public homeService: HomeService, public floorscaleService: FloorscaleService) {}
  // @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.floorscaleService.onFrmGroupChange();
  }
}
