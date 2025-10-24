import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { HttpErrorResponse } from '@angular/common/http';
import { CutsService } from '../cuts.service';

import { Subscription } from 'rxjs';

import { MatSort, MatSortModule } from '@angular/material/sort';
import { AlertMessage } from '../../../../layout/alert/alert-message';

import { ConfirmationDialogComponent } from '../../../../layout/confirmation-dialog/confirmation-dialog.component';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from '../../../../layout/alert/alert.component';
import { MatProgressSpinnerComponent } from '../../../../layout/mat-progress-spinner/mat-progress-spinner.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortCacheDirective } from '../../../../mat-sort-cache.directive';
import { MatTableModule } from '@angular/material/table';
import { Unix2ShortDate } from '../../../../pipes.pipe';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../../users/login/auth.service';
import { ConfirmationDialogInterface } from '../../../../users/user.model';
import { UserRoleEnum } from '../../../../users/login/auth-models';
import { Trimline } from '../../datasource/trimline';
import { TrimlineService } from '../../datasource/trimline.service';

@Component({
  selector: 'app-cuts-browser',
  templateUrl: './cuts-browser.component.html',
  styleUrls: ['./cuts-browser.component.scss', '../../../../../styles/table.scss'],
  imports: [
    MatTableModule,
    MatSortModule,
    //MatSortCacheDirective,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatProgressSpinnerComponent,
    AlertComponent,
    FormsModule,
    //MatLabel,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    Unix2ShortDate,
    CommonModule,
    MatTooltipModule,
  ],
})
export class CutsBrowserComponent implements OnDestroy, OnInit, AfterViewInit {
  alert = new AlertMessage();
  showSpinner = false;
  //homeService = inject(HomeService);
  cutService = inject(CutsService);
  router = inject(Router);
  userService = inject(AuthService);

  columns = ['code', 'description', 'cutName', 'customer', 'username', 'timestamp', 'action'];

  dialog = inject(MatDialog);
  addNewDisabled = false;
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  trimlineService = inject(TrimlineService);
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    // this.homeService.disableServerSelection = false;
    this.onServerChange();
    // this.subscription = this.homeService.serverChangeEvent$.subscribe((serverIndex) => {
    //   this.onServerChange();
    // });
  }

  ngAfterViewInit() {
    this.cutService.dataSourceCutInfo.sort = this.sort;
  }

  async onServerChange() {
    this.alert.clear();
    try {
      this.showSpinner = true;
      const res = await this.cutService.loadCutsAsync();
      this.cutService.dataSourceCutInfo.data = res.cuts;
      //this.homeService.loadPatterns();
    } catch (err) {
      this.cutService.dataSourceCutInfo.data = [];
      this.alert.setError('Unable to load product cuts. ' + this.alert.getErrorMessage(err));
    } finally {
      this.showSpinner = false;
    }
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
    //this.homeService.disableServerSelection = false;
  }

  onDelete(productKey: number) {
    if (this.userService.canExecute(['Admin', 'Super'], this.router.url)) {
      const dialogData: ConfirmationDialogInterface = {
        title: 'Please Confirm',
        content: 'Are you sure you want to delete this cut?',
        returnVal: productKey,
      };
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '450px',
        backdropClass: 'custom-dialog-backdrop-class',
        panelClass: 'custom-dialog-panel-class',
        data: dialogData,
      });

      dialogRef.afterClosed().subscribe((productKey) => {
        if (productKey !== undefined) {
          this.deleteCode(productKey);
        }
      });
    }
  }

  async deleteCode(code: string) {
    const temp = this.cutService.dataSourceCutInfo.data;
    const i = temp.findIndex((e) => {
      return e.code === code;
    });
    if (i > -1) {
      temp.splice(i, 1);
      try {
        await this.cutService.saveCutsAsync(temp);
        const res = await this.cutService.loadCutsAsync();
        this.cutService.dataSourceCutInfo.data = res.cuts;
      } catch (err) {
        this.alert.setError('Unable to confirm delete. ' + this.alert.getErrorMessage(err));
      }
    }
  }

  onAdd() {
    this.cutService.selectedCutCode = '';
    this.router.navigate(['/home/cutseditor']);
  }

  onEdit(key: string) {
    this.cutService.selectedCutCode = key;
    this.router.navigate(['/home/cutseditor']);
  }

  get isAdminOrSuper() {
    return this.userService.userInRole(UserRoleEnum.Admin) || this.userService.userInRole(UserRoleEnum.Super);
  }

  onExport() {
    // this.openDialog();
  }

  //   openDialog() {
  //     const dataObj: IExporterData = {
  //       prompt: `Exporting ${this.homeService.selectedServer.server} cuts to all servers...`,
  //       endPoint: 'api/products/saveCuts',
  //       data: this.homeService.dataSourceCutInfo.data,
  //     };

  //     const dialogConfig = new MatDialogConfig();

  //     dialogConfig.disableClose = true;
  //     dialogConfig.autoFocus = true;

  //     const dialogRef = this.dialog.open(ExporterComponent, {
  //       width: '980px',
  //       data: dataObj,
  //       disableClose: true,
  //       autoFocus: true,
  //     });
  //     dialogRef.afterClosed().subscribe((dialogAction) => {
  //       // this.importDisabled = dialogAction;
  //       // this.exportdisabled = !dialogAction;
  //     });
  //   }
}
