import { Component, OnInit, ViewChild } from '@angular/core';

import { Router, ActivatedRoute, RouterModule } from '@angular/router';

import { AuthService } from '../login/auth.service';

import { ConfirmationDialogInterface } from '../user.model';
import { UserInterface } from '../login/auth-models';

import { Subscription } from 'rxjs';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { MatTableModule } from '@angular/material/table';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../layout/alert/alert.component';
import { ConfirmationDialogComponent } from '../../layout/confirmation-dialog/confirmation-dialog.component';
import { TrimlineService } from '../../reports/trimline/datasource/trimline.service';

@Component({
  selector: 'app-user-browser',
  templateUrl: './user-browser.component.html',
  styleUrls: ['./user-browser.component.scss', '../../../styles/table.scss'],
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
    //MatProgressSpinnerComponent,
    AlertComponent,
    FormsModule,
    //MatLabel,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
  ],
})
export class UserBrowserComponent implements OnInit {
  displayedColumns = ['username', 'firstName', 'lastName', 'roles', 'edit'];
  status = ['Disabled', 'Active', 'Locked', 'Unverified'];
  subscription: Subscription = new Subscription();
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  constructor(public authService: AuthService, public router: Router, private dialog: MatDialog, public trimlineService: TrimlineService) {}

  ngOnInit(): void {
    this.authService.alert.setInfo(
      'The User role can clear totals, change codes and update message boards.  The Super role can also manage products and employees.  The Admin role has total control including managing user accounts.'
    );

    this.onServerChange();
    // this.subscription = this.authService.homeService.serverChangeEvent$.subscribe((serverIndex) => {
    //   this.authService.alert.setInfo(
    //     'The User role can clear totals, change codes and update message boards.  The Super role can also manage products and employees.  The Admin role has total control including managing user accounts.'
    //   );
    //   this.onServerChange();
    // });
  }

  async onServerChange() {
    try {
      // this.authService.dataSourceLoadedUsers.data = [];
      const res = await this.authService.loadusers();
      if (!res || !res.users) {
        this.authService.dataSourceLoadedUsers.data = [];
        return;
      }
      this.authService.dataSourceLoadedUsers.data = res.users.map((e) => {
        // @ts-ignore
        e.roles = e.roles.split(',');
        return e;
      });
    } catch (err) {
      this.authService.alert.setError(err);
      this.authService.dataSourceLoadedUsers.data = [];
    }
  }

  ngAfterViewInit() {
    this.authService.dataSourceLoadedUsers.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
    //this.authService.homeService.disableServerSelection = false;
  }

  async getAllUsers() {
    try {
      const res = await this.authService.getAllUsers();
      this.authService.dataSourceLoadedUsers.data = [...res];
    } catch (err) {
      this.authService.dataSourceLoadedUsers.data = [];
      this.authService.alert.setError(err);
    }
  }

  onEdit(user: UserInterface) {
    this.router.navigate(['/edituser', user]);
  }

  onCancel() {
    this.router.navigate(['/home']);
  }

  async onDelete(user: UserInterface) {
    this.authService.alert.clear();
    const dialogData: ConfirmationDialogInterface = {
      title: 'Please Confirm',
      content: 'Are you sure you want to delete this user?',
      returnVal: user,
      yesButtonName: 'Yes',
      noButtonName: 'Cancel',
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((user) => {
      if (user !== undefined) {
        if (this.authService.loadedUser.username === user.username) {
          this.authService.alert.setError('User cannot delete their own account!');
          return;
        }
        try {
          (async () => {
            const res = await this.authService.deleteUser(user.username);
            this.getAllUsers();
          })();
        } catch (err) {
          this.authService.alert.setError(err);
        }
      }
    });
  }

  onExport() {
    //  this.openDialog();
  }

  // openDialog() {
  //   const users = this.authService.copyObject(this.authService.dataSourceLoadedUsers.data);
  //   users.map((e) => {
  //     //@ts-ignore
  //     e.roles = e.roles.join(',');
  //     // e.firstName = 'first';
  //     // e.lastName = 'last';
  //     return e;
  //   });
  //   const dataObj: IExporterData = {
  //     prompt: `Exporting ${this.authService.homeService.selectedServer.server} users to all servers...`,
  //     endPoint: 'api/users/saveusers',
  //     data: { users: users as UserInterface[] },
  //   };

  //   const dialogConfig = new MatDialogConfig();

  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;

  //   const dialogRef = this.dialog.open(ExporterComponent, {
  //     width: '980px',
  //     data: dataObj,
  //     disableClose: true,
  //     autoFocus: true,
  //   });
  //   dialogRef.afterClosed().subscribe((dialogAction) => {
  //     // this.importDisabled = dialogAction;
  //     // this.exportdisabled = !dialogAction;
  //   });
  // }
}
