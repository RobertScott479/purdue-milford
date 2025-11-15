import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { delay, timeout } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';

import { QcService } from '../qc.service';
import { AlertComponent } from '../../../../layout/alert/alert.component';
import { KeypadComponent } from '../../../../keypad/keypad.component';
import { AlertMessage } from '../../../../layout/alert/alert-message';
import { SideNavService } from '../../../../layout/sidenav/sidenav.service';
import { TrimlineService } from '../../datasource/trimline.service';
import { EmployeeService } from '../../employees/employee.service';
import { ErrorResInterface } from '../../../../models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-qc-samples',
  templateUrl: './qc-samples.component.html',
  styleUrls: ['./qc-samples.component.scss'],
  standalone: true,
  imports: [KeypadComponent, MatCardModule],
})
export class QcSamplesComponent implements OnInit, OnDestroy {
  dialogRef = inject<MatDialogRef<QcSamplesComponent>>(MatDialogRef);
  data = inject<number>(MAT_DIALOG_DATA);

  constructor() {}

  ngOnInit(): void {}

  onKeyPress() {}

  ngOnDestroy(): void {}

  async onEnter(sampleCount: string) {
    this.dialogRef.close(parseInt(sampleCount));
  }
}
