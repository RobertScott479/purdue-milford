import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ErrorHandler, NgZone, OnDestroy, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, of } from 'rxjs';

import { delay, timeout } from 'rxjs/operators';

import { QcService } from '../qc.service';
import { ICutInfo } from '../../cuts/cuts.model';
import { ICheckEventInput, ICheckEventInputRes, ICheckEventOutput, IDefectInfo, IPieces, QaLogModel } from '../qc.model';
import { ConfirmationDialogInterface } from '../../../../layout/confirmation-dialog/confirmation.model';
import { ConfirmationDialogComponent } from '../../../../layout/confirmation-dialog/confirmation-dialog.component';
import { ErrorResInterface } from '../../../../models';
import { AlertMessage } from '../../../../layout/alert/alert-message';
import { HomeService } from '../../../../home.service';
import { CutsService } from '../../cuts/cuts.service';
import { EmployeeService } from '../../employees/employee.service';

import { MatButton, MatButtonModule } from '@angular/material/button';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatRipple } from '@angular/material/core';
import { AlertComponent } from '../../../../layout/alert/alert.component';
import { MatProgressSpinnerComponent } from '../../../../layout/mat-progress-spinner/mat-progress-spinner.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { QcSamplesComponent } from '../qc-samples/qc-samples.component';

@Component({
  selector: 'app-qc-check',
  templateUrl: './qc-check.component.html',
  styleUrls: ['./qc-check.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    NgIf,
    MatProgressSpinnerComponent,
    NgFor,
    MatRipple,
    AlertComponent,
    MatCardModule,
    MatGridListModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class QcCheckComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  alert = new AlertMessage();

  pollTmr: any;
  checkTmr: any;
  showSpinner = false;
  //checker_cutter_number = 0;
  checkerName = '';
  disableCheck = true;

  cutInfo: ICutInfo | undefined;
  cutName: string = '';

  checkEventOutput: ICheckEventOutput = {
    checker_cutter_number: 0,
    product: '',
    checkEvent: { cutter_number: 0, weight: 0, station: '', bank: 0, timestamp: 0, cut: 'primary', index: 0 },
    defects: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    inspectionTime: 0,
    passed: 0,
    failed: 0,
    canceled: 0,
    total: 0,
    pieces: [{ weight: 0, timestamp: 0 }],
    finishedPO: '123',
    aqlScore: 0,
    aqlStandard: 0,
  };

  demeritInfo: IDefectInfo[] = [];
  defectsDefined = false;
  checkCancel = false;

  checkInProgress = false;
  checkProgress = 100;
  progressBarMode = 'determinate';
  checkStart = 0;
  checkStop = 0;
  //cutterName = '';
  pieceWeight = signal(0);
  piecesToCheck = 0;
  constructor(
    public dialog: MatDialog,
    public qcService: QcService,
    private homeService: HomeService,
    public cutsService: CutsService,
    private httpClient: HttpClient,
    private employeeService: EmployeeService,
    private router: Router //private sideNavService: SideNavService
  ) {}

  getCutIndexFromCut(cut: string): number {
    return 0;
  }

  ngOnInit(): void {
    //this.initWeightCapture();
    this.alert.clear();
    //verify checker is legit

    if (this.qcService.activeChecker.cutter_number === 0) {
      this.logout(); //page refreshed while on check page, go back to login.
    }
    const checkerValid = this.qcService.activeChecker.cutter_number > 0 && this.qcService.activeChecker.enabled === true;
    if (!checkerValid) {
      //should never get here unless user bypassed the qclogin.
      this.alert.setError('Checker invalid!');
    } else {
      (async () => {
        const err = await this.cutsService.loadCutsAsync1();
        this.disableCheck = !(checkerValid && err === '');
        if (!this.disableCheck) {
          this.alert.setInfo('Waiting for check event...');
          this.startPolling(3000);
        }
      })();
    }
  }

  initCheckEventOut() {
    this.checkEventOutput = {
      checker_cutter_number: 0,
      product: '',
      checkEvent: { cutter_number: 0, weight: 0, station: '', bank: 0, timestamp: 0, cut: '', index: 0 },
      defects: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      inspectionTime: 0,
      passed: 0,
      failed: 0,
      canceled: 0,
      pieces: [],
      finishedPO: '123',
      aqlScore: 0,
      aqlStandard: 0,
    };
  }

  async canDeactivate(): Promise<boolean> {
    if (this.showSpinner) {
      return false; //api call active so abort route change!
    }

    if (this.checkInProgress) {
      const dialogData: ConfirmationDialogInterface = {
        title: 'Please Confirm',
        content: 'You have a check pending. Logout anyway?',
        yesButton: 'Yes',
        noButton: 'No',
        returnVal: '',
      };
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '450px',
        data: dialogData,
      });

      const response = await dialogRef.afterClosed().toPromise();
      if (response === undefined) {
        return false;
      } else {
        const canceled = await this.cancelCheck();
        if (!canceled) {
          return false; //failed to get expected response. abort route change!
        }
      }
    }

    this.stopPolling();
    await this.logoutChecker();
    this.dialog.closeAll();
    return true;
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
    //this.homeService.disableServerSelection = false;
    this.alert.clear();
    // if (this.router.routerState.snapshot.url.indexOf('qclogin') === -1) {
    //   this.homeService.startRefreshTimer(0);
    // }
  }

  // initWeightCapture() {
  //   this.subscription = this.qcService.openEventSource('/api/qc/getWeightSSE').subscribe({
  //     next: (payload: string) => {
  //       if (this.checkInProgress && this.checkEventOutput.pieces.length < this.piecesToCheck) {
  //         const result = JSON.parse(payload);
  //         this.pieceWeight.set(result.weight);
  //         this.newPieceEvent();
  //       }
  //     },
  //     error: (err) => {
  //       //most likely error is the connection was closed on the server side
  //       console.log(err);
  //     },
  //   });
  // }

  // newPieceEvent() {
  //   const piece: IPieces = { weight: this.pieceWeight() };
  //   this.checkEventOutput?.pieces?.push(piece);
  //   this.LogQAEvent(`${piece.weight}g`);
  // }

  stopPolling() {
    clearTimeout(this.pollTmr);
  }

  startPolling(delay: number) {
    clearTimeout(this.pollTmr);
    this.initCheckEventOut();
    this.pollTmr = setTimeout(() => {
      this.poll();
    }, delay);
  }

  async poll() {
    try {
      // this.homeService.alert.clear();
      this.showSpinner = true;
      this.progressBarMode = 'indeterminate';
      const res = await this.httpClient.get<ICheckEventInputRes>(`/api/qc/getCheckEvent`).pipe(timeout(10000)).pipe(delay(0)).toPromise();
      if (res === undefined) {
        throw new Error('No response from server');
      }

      if (res.errorCode === '0') {
        await this.newCheckEvent(res.checkEvent);
      } else if (res.errorCode === '1') {
        // all good no check event yet
        this.alert.setInfo(`Waiting for check event...    ${new Date().toLocaleString()}`);
        this.startPolling(3000);
      } else if (res.errorCode === '2') {
        this.alert.setInfo(`No product code!`);
        this.startPolling(3000);
      } else {
        this.alert.setError('getCheckEvent error: ' + res.errorMessage);
        this.startPolling(10000);
      }
    } catch (err) {
      this.alert.setError(this.alert.getErrorMessage(err));
      this.startPolling(10000);
    } finally {
      this.showSpinner = false;
      this.progressBarMode = 'determinate';
    }
  }

  async cancelCheck(): Promise<boolean> {
    this.showSpinner = true;
    this.progressBarMode = 'indeterminate';
    this.alert.setInfo('Canceling check...');
    try {
      await this.LogQAEvent('Check Canceled');
      const res = await this.httpClient
        .post<ErrorResInterface>(`/api/qc/cancelCheckEvent`, {}, this.homeService.httpOptions)
        .pipe(timeout(this.qcService.timeoutDelay))
        .pipe(delay(1200))
        .toPromise();
      this.checkInProgress = false;
      clearInterval(this.checkTmr);
      return true;
    } catch (err) {
      this.alert.setError(this.alert.getErrorMessage(err));
      return false;
    } finally {
      this.showSpinner = false;
      this.progressBarMode = 'determinate';
    }
  }

  async newCheckEvent(checkEvent: ICheckEventInput): Promise<boolean> {
    this.checkInProgress = true;

    const fetched = true;
    if (!fetched) {
      return false;
    }

    const productCode = checkEvent.cut ?? 'NULL';

    const emp = this.employeeService.getEmployeeName(checkEvent.cutter_number);

    this.alert.setInfo(`${checkEvent.station}: ${emp}`);

    this.cutInfo = this.cutsService.dataSourceCutInfo.data.find((e) => e.code === productCode);

    if (!this.cutInfo) {
      this.alert.setError(`Code (${productCode}) is not defined in the Cuts page! Correct the issue then login again.`);
      return false;
    } else {
      this.checkEventOutput.checker_cutter_number = this.qcService.activeChecker.cutter_number;
      this.checkEventOutput.product = productCode;
      this.cutName = this.cutInfo.cutName;
      this.checkEventOutput.checkEvent = checkEvent;
      // this.checkEventOutput.finishedPO = this.qcService.getFinishedPO(checkEvent.cut);

      this.demeritInfo = [];
      this.defectsDefined = false;

      this.piecesToCheck = this.cutInfo.sampleSize;

      for (let i = 1; i < 11; i++) {
        const defect: IDefectInfo = {
          index: i - 1,
          sampleSize: this.cutInfo.sampleSize,
          // @ts-ignore
          question: this.cutInfo['question' + i],
          // @ts-ignore
          confidence: this.cutInfo[`q${i}Confidence`],
          occurances: 0,
        };
        this.demeritInfo.push(defect);
        if (defect.question.trim() !== 'N/A' && defect.question.trim() !== 'NA') {
          this.defectsDefined = true;
        }
      }
      if (this.defectsDefined) {
        this.startCheckTimer();
        return true;
      } else {
        this.alert.setInfo(
          'No QA questions defined for this product/cut yet. Notify supervisor to add QA questions to the product definition page. Then log out and in again.'
        );
        return false;
      }
    }
  }

  logout() {
    this.router.navigate(['/qc-login']);
  }

  async logoutChecker(): Promise<boolean> {
    this.alert.setInfo('Logging out...');
    try {
      const res = await this.httpClient
        .post<ErrorResInterface>(`/api/qc/logoutchecker`, {}, this.homeService.httpOptions)
        .pipe(timeout(this.qcService.timeoutDelay))
        .pipe(delay(1000))
        .toPromise();
    } catch (error) {
      this.alert.setError(error);
    } finally {
      return true;
    }
  }

  async onOccurance(index: number) {
    this.demeritInfo[index].occurances += 1;
    await this.LogQAEvent(this.demeritInfo[index].question);
  }

  // validatePieceCount() {
  //   const pieces = this.checkEventOutput.pieces ?? [];
  //   const piecesTotalWeight = pieces.reduce((a, b) => a + b.weight, 0);
  //   if (pieces.length < this.piecesToCheck) {
  //     const batchWeightGrams = this.checkEventOutput.checkEvent.weight * 453.59237;
  //     if (piecesTotalWeight < batchWeightGrams * 0.9) {
  //       this.alert.setWarning(
  //         `Weight mismatch! Pieces total weight: ${piecesTotalWeight.toFixed(0)}g vs. batch weight: ${batchWeightGrams.toFixed(0)}g`
  //       );
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  async onSubmit() {
    // if (this.validatePieceCount() === false) {

    //   const dialogData: ConfirmationDialogInterface = {
    //     title: 'Please Confirm',
    //     content: `Piece count was less than expected.  Are you sure you want to submit now? `,
    //     returnVal: '',
    //   };
    //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //     width: '450px',
    //     data: dialogData,
    //   });

    //   const response = await dialogRef.afterClosed().toPromise();
    //   if (response === undefined) {
    //     const emp = this.employeeService.getEmployeeName(this.checkEventOutput.checkEvent.cutter_number);
    //     this.alert.setInfo(`${this.checkEventOutput.checkEvent.station}: ${emp}`);
    //     return false;
    //   }
    // }

    this.showSpinner = true;
    this.progressBarMode = 'indeterminate';
    this.alert.setSuccess('Submitting check...');
    await this.submit();
    return true;
  }

  async sendCheckEvent(event: ICheckEventOutput): Promise<ErrorResInterface> {
    const res = await this.httpClient
      .post<ErrorResInterface>('/api/qc/setCheckEvent', this.checkEventOutput, this.homeService.httpOptions)
      .pipe(timeout(this.qcService.timeoutDelay))
      .pipe(delay(1200))
      .toPromise();
    if (res === undefined) {
      throw new Error('No response from server');
    }
    return res;
  }

  calculateAQLScore(): number {
    let aqlScore = 0;
    let ConfidenceLevel99CheckFailed = false;
    let aqlAccumulator = 100;

    return aqlScore;
  }

  async submit() {
    try {
      let passed = true;
      let hasCriticalDefect = false;
      this.checkEventOutput.aqlScore = 1.0;
      for (let i = 0; i < this.demeritInfo.length; i++) {
        this.checkEventOutput.defects[i] = this.demeritInfo[i].occurances;
        const occurances = this.demeritInfo[i].occurances;
        const sampleSize = this.demeritInfo[i].sampleSize;
        const confidence = this.demeritInfo[i].confidence;
        const MinAcceptable = sampleSize - sampleSize * (confidence / 100);
        passed = occurances > MinAcceptable ? false : passed;
        if (confidence > 0) {
          if (occurances > MinAcceptable) {
            hasCriticalDefect = true;
          }

          if (hasCriticalDefect) {
            this.checkEventOutput.aqlScore = 0;
          } else {
            this.checkEventOutput.aqlScore -= occurances / sampleSize;
          }
        }
      }
      this.checkEventOutput.aqlScore = Math.max(0, this.checkEventOutput.aqlScore * 100);
      this.checkEventOutput.aqlStandard = this.cutInfo ? this.cutInfo.aqlScoreStandard : 0;
      this.checkStop = performance.now();
      this.checkEventOutput.inspectionTime = (this.checkStop - this.checkStart) / 1000;
      this.checkEventOutput.passed = passed ? 1 : 0;
      this.checkEventOutput.failed = passed ? 0 : 1;

      await this.LogQAEvent(`Check ${passed ? 'Passed' : 'Failed'}`);
      const res = await this.sendCheckEvent(this.checkEventOutput);

      if (res.errorCode === '0') {
        if (passed) {
          this.alert.setSuccess(`Check Passed for station ${this.checkEventOutput.checkEvent.station}`);
          this.startPolling(5000);
        } else {
          this.alert.setInfo(`Check failed for station ${this.checkEventOutput.checkEvent.station}`);
          this.startPolling(8000);
        }

        this.checkInProgress = false;
        this.defectsDefined = false;
        clearInterval(this.checkTmr);
      } else {
        this.alert.setError(res.errorMessage);
      }
    } catch (err) {
      this.alert.setError(err);
    } finally {
      this.showSpinner = false;
      this.progressBarMode = 'determinate';
    }
  }

  async onReset() {
    await this.LogQAEvent('Check Reset');
    this.checkEventOutput.pieces = [];
    for (let i = 0; i < 10; i++) {
      this.demeritInfo[i].occurances = 0;
    }
  }

  startCheckTimer() {
    this.LogQAEvent('Check Started.');
    this.checkStop = 0;
    this.checkStart = performance.now();
    this.checkTmr = setInterval(() => {
      this.checkEventOutput.inspectionTime = (performance.now() - this.checkStart) / 1000;
    }, 1000);
  }

  async LogQAEvent(Event: string) {
    if (this.checkEventOutput.product === '') return;
    const check: ICheckEventOutput = this.checkEventOutput;
    const qaEvent: QaLogModel = {
      checker_cutter_number: check.checker_cutter_number,
      cutter_number: check.checkEvent.cutter_number,
      product: check.product,
      cut: check.checkEvent.cut,
      station: check.checkEvent.station,
      weight: check.checkEvent.weight,
      index: check.checkEvent.index,
      timestamp: Math.floor(new Date().getTime() / 1000),
      description: Event,
      inspectionTime: check.inspectionTime,
    };
    try {
      const res = await this.qcService.httpClient.post<ErrorResInterface>(`/api/qalog/addevent`, qaEvent).toPromise();
    } catch (err) {
      this.alert.setError(err);
    }
  }

  get filterDemeritInfo() {
    return this.demeritInfo.filter((d) => d.question !== 'N/A' && d.question !== 'NA');
  }

  async setSamples() {
    const dialogRef = this.dialog.open(QcSamplesComponent, {
      width: '700px',
      data: this.checkEventOutput?.pieces?.length.toString() || '0',
    });

    const sampleCount = await dialogRef.afterClosed().toPromise();
    this.checkEventOutput.pieces = [];
    for (let i = 0; i < sampleCount; i++) {
      this.checkEventOutput.pieces.push({ weight: 0, timestamp: 0 });
    }
  }
}
