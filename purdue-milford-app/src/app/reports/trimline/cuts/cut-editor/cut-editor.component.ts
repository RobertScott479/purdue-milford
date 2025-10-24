import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { CutsService } from '../cuts.service';
import { Router } from '@angular/router';

import { ICutInfo } from '../cuts.model';

import { MatDialog } from '@angular/material/dialog';
import { HomeService } from '../../../../home.service';

import { AlertMessage } from '../../../../layout/alert/alert-message';

import { ConfirmationDialogComponent } from '../../../../layout/confirmation-dialog/confirmation-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AlertComponent } from '../../../../layout/alert/alert.component';
import { MatProgressSpinnerComponent } from '../../../../layout/mat-progress-spinner/mat-progress-spinner.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../../users/login/auth.service';
import { ConfirmationDialogInterface } from '../../../../users/user.model';

@Component({
  selector: 'app-cut-editor',

  templateUrl: './cut-editor.component.html',
  styleUrl: './cut-editor.component.scss',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatProgressBarModule,
    AlertComponent,
    MatProgressSpinnerComponent,
    MatSelectModule,
    MatIconModule,
    CommonModule,
    MatInputModule,
    MatSlideToggleModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
  ],
})
export class CutEditorComponent implements OnInit {
  alert = new AlertMessage();
  showSpinner = false;
  submitted = false;
  cutsService = inject(CutsService);
  router = inject(Router);
  homeService = inject(HomeService);
  authService = inject(AuthService);
  dialog = inject(MatDialog);
  action = '';

  frmGroupCuts = new UntypedFormGroup({
    code: new UntypedFormControl('', [Validators.required, Validators.maxLength(20)]),
    cutName: new UntypedFormControl('', Validators.maxLength(7)),
    description: new UntypedFormControl('', [Validators.required, Validators.maxLength(200)]),
    customer: new UntypedFormControl('', [Validators.required, Validators.maxLength(200)]),
    cutRate: new UntypedFormControl(0, Validators.required),
    ppmh: new UntypedFormControl(0, Validators.required),
    pattern: new UntypedFormControl('', Validators.required),
    standardPrimaryYield: new UntypedFormControl(0, [Validators.required, Validators.min(0), Validators.max(99)]),
    aqlScoreStandard: new UntypedFormControl(0, [Validators.required, Validators.min(0), Validators.max(99)]),
    weightScoreStandard: new UntypedFormControl(0, [Validators.required, Validators.min(0), Validators.max(99)]),
    sampleSize: new UntypedFormControl(0, [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern(/^[0-9]{1,2}$/)]),
    weightMinimum: new UntypedFormControl(0, [Validators.required, Validators.min(0), Validators.max(999)]),
    weightMaximum: new UntypedFormControl(0, [Validators.required, Validators.min(0), Validators.max(999)]),
    wtConfidence: new UntypedFormControl(0, [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern(/^[0-9]{1,2}$/)]),

    question1: new UntypedFormControl('N/A', Validators.required),
    q1Confidence: new UntypedFormControl(0, [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern(/^[0-9]{1,2}$/)]),
    question2: new UntypedFormControl('', Validators.required),
    q2Confidence: new UntypedFormControl(0, [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern(/^[0-9]{1,2}$/)]),
    question3: new UntypedFormControl('', Validators.required),
    q3Confidence: new UntypedFormControl(0, [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern(/^[0-9]{1,2}$/)]),
    question4: new UntypedFormControl('', Validators.required),
    q4Confidence: new UntypedFormControl(0, [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern(/^[0-9]{1,2}$/)]),
    question5: new UntypedFormControl('', Validators.required),
    q5Confidence: new UntypedFormControl(0, [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern(/^[0-9]{1,2}$/)]),
    question6: new UntypedFormControl('', Validators.required),
    q6Confidence: new UntypedFormControl(0, [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern(/^[0-9]{1,2}$/)]),
    question7: new UntypedFormControl('', Validators.required),
    q7Confidence: new UntypedFormControl(0, [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern(/^[0-9]{1,2}$/)]),
    question8: new UntypedFormControl('', Validators.required),
    q8Confidence: new UntypedFormControl(0, [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern(/^[0-9]{1,2}$/)]),
    question9: new UntypedFormControl('', Validators.required),
    q9Confidence: new UntypedFormControl(0, [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern(/^[0-9]{1,2}$/)]),
    question10: new UntypedFormControl('', Validators.required),
    q10Confidence: new UntypedFormControl(0, [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern(/^[0-9]{1,2}$/)]),

    username: new UntypedFormControl('', Validators.required),
    timestamp: new UntypedFormControl(0, Validators.required),
  });

  async canDeactivate(): Promise<boolean> {
    if (this.frmGroupCuts.dirty) {
      const dialogData: ConfirmationDialogInterface = {
        title: 'Please Confirm',
        content: 'You have unsaved changes. Continue anyway?',
        returnVal: '',
      };
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '470px',
        data: dialogData,
      });

      const response = await dialogRef.afterClosed().toPromise();
      if (response === undefined) {
        return false;
      } else {
        this.onCancel();
        return true;
      }
    }
    return true;
  }

  ngOnInit() {
    //this.homeService.disableServerSelection = true;
    this.frmGroupCuts.reset();
    this.alert.clear();

    this.submitted = false;
    const insertMode = this.cutsService.selectedCutCode === '';

    this.frmGroupCuts.get('username')?.setValue(this.authService.loadedUser.username);
    const unixTimestamp = Math.floor(new Date().getTime() / 1000);
    this.frmGroupCuts.get('timestamp')?.setValue(unixTimestamp);

    this.action = insertMode ? 'Add' : 'Edit';
    if (insertMode) {
      this.frmGroupCuts.get('code')?.setValue('');
      this.frmGroupCuts.get('cutName')?.setValue('');
      this.frmGroupCuts.get('description')?.setValue('');
      this.frmGroupCuts.get('customer')?.setValue('');
      this.frmGroupCuts.get('cutRate')?.setValue(0);
      this.frmGroupCuts.get('ppmh')?.setValue(0);
      this.frmGroupCuts.get('standardPrimaryYield')?.setValue(0);
      this.frmGroupCuts.get('aqlScoreStandard')?.setValue(0);
      this.frmGroupCuts.get('weightScoreStandard')?.setValue(0);
      this.frmGroupCuts.get('sampleSize')?.setValue(0);
      this.frmGroupCuts.get('weightMinimum')?.setValue(0);
      this.frmGroupCuts.get('weightMaximum')?.setValue(0);
      this.frmGroupCuts.get('wtConfidence')?.setValue(0);

      for (let i = 1; i <= 10; i++) {
        this.frmGroupCuts.get('question' + i)?.setValue('N/A');
        this.frmGroupCuts.get(`q${i}Confidence`)?.setValue(0);
      }
    } else {
      const row = this.cutsService.dataSourceCutInfo.data.find((e) => {
        return e.code === this.cutsService.selectedCutCode;
      });

      if (!row) return;

      this.frmGroupCuts.get('code')?.setValue(row.code);
      this.frmGroupCuts.get('cutName')?.setValue(row.cutName);
      this.frmGroupCuts.get('description')?.setValue(row.description);
      this.frmGroupCuts.get('customer')?.setValue(row.customer);
      this.frmGroupCuts.get('cutRate')?.setValue(row.cutRate);
      this.frmGroupCuts.get('ppmh')?.setValue(row.ppmh);
      this.frmGroupCuts.get('standardPrimaryYield')?.setValue(row.standardPrimaryYield);
      this.frmGroupCuts.get('aqlScoreStandard')?.setValue(row.aqlScoreStandard);
      this.frmGroupCuts.get('weightScoreStandard')?.setValue(row.weightScoreStandard);
      this.frmGroupCuts.get('pattern')?.setValue(row.pattern);
      this.frmGroupCuts.get('sampleSize')?.setValue(row.sampleSize);
      this.frmGroupCuts.get('weightMinimum')?.setValue(row.weightMinimum);
      this.frmGroupCuts.get('weightMaximum')?.setValue(row.weightMaximum);
      this.frmGroupCuts.get('wtConfidence')?.setValue(row.wtConfidence);

      for (let i = 1; i <= 10; i++) {
        // @ts-ignore
        this.frmGroupCuts.get('question' + i)?.setValue(row['question' + i] ?? 'N/A');
        // @ts-ignore
        this.frmGroupCuts.get(`q${i}Confidence`)?.setValue(row[`q${i}Confidence`] ?? 0);
      }
    }
  }

  getErrorMessage(name: string) {
    // if (this.frmGroupProducts.get(name).hasError('pattern')) {
    //   return 'Expecting 0-99!';
    // }
    if (this.frmGroupCuts.get(name)?.hasError('required')) {
      return 'Required!';
    }
    // } else if (this.frmGroupProducts.get(name).hasError('min')) {
    //   return 'Too low!';
    // } else if (this.frmGroupProducts.get(name).hasError('max')) {
    //   return 'Too high!';
    // } else if (this.frmGroupProducts.get(name).hasError('maxlength')) {
    //   return '10 alpha-numeric max!';
    // }
    return null;
  }

  async onSave() {
    this.submitted = true;
    if (this.frmGroupCuts.valid) {
      const frm = this.frmGroupCuts.getRawValue() as ICutInfo;
      const temp: ICutInfo[] = this.cutsService.dataSourceCutInfo.data.slice(); // this.homeService.copyObject(this.homeService.dataSourceCutInfo.data);
      let row = temp.findIndex((e) => {
        return e.code === frm.code;
      });
      if (this.cutsService.selectedCutCode === '') {
        if (row > -1) {
          this.alert.setError('Code already exists!');
          return;
        } else {
          temp.push(this.frmGroupCuts.value);
          await this.save(temp);
        }
        //update
      } else {
        if (row > -1) {
          temp[row] = frm;
          await this.save(temp);
        }
      }
    } else {
      this.alert.setError('Please correct all issues and submit again.');
    }
    window.scrollTo(0, 0);
  }

  async save(cuts: ICutInfo[]): Promise<boolean> {
    try {
      this.showSpinner = true;
      await this.cutsService.saveCutsAsync(cuts);
      this.cutsService.dataSourceCutInfo.data = cuts;
      this.frmGroupCuts.reset();
      this.router.navigate(['/cutsbrowser']);
    } catch (err) {
      this.alert.setError('Unable to confirm save. ' + this.alert.getErrorMessage(err));
    } finally {
      this.showSpinner = false;
    }

    return true;
  }

  onBack() {
    this.router.navigate(['/home/cutsbrowser']);
  }

  onCancel() {
    this.ngOnInit();
  }

  onPaste() {
    this.frmGroupCuts.setValue(this.cutsService.cutClipboard);
    this.frmGroupCuts.markAsDirty();
  }
}
