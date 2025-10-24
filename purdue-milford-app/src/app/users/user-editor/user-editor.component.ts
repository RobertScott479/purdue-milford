import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

import { HttpErrorResponse } from '@angular/common/http';
import { iif } from 'rxjs';
import { AuthService } from '../login/auth.service';
import { UserInterface, UserRoleEnum } from '../login/auth-models';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AlertComponent } from '../../layout/alert/alert.component';
import { MatProgressSpinnerComponent } from '../../layout/mat-progress-spinner/mat-progress-spinner.component';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss'],
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
  ],
})
export class UserEditorComponent implements OnInit, OnDestroy {
  constructor(public authService: AuthService, private route: ActivatedRoute, private router: Router, private location: Location) {}

  // userId:string;
  formGrp = new FormGroup({
    // id: new FormControl(''), // placeholder
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    username: new FormControl({ value: '', disabled: true }, [Validators.required]),
    // jobTitle: new FormControl('', [Validators.required]),
    // company: new FormControl('', [Validators.required]),
    // phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
    roles: new FormControl<string[]>(['user'], Validators.required),
    password: new FormControl('', Validators.required),
    // active: new FormControl(0),
  });

  submited = false;
  // alert = new AlertMessage();
  // ErrorMessage = '';
  // editEnabled = false;
  redirectTimer: any;
  defaultUser: UserInterface = { username: '', firstName: '', lastName: '', roles: ['User'], password: '' };
  loadedUser: UserInterface = JSON.parse(JSON.stringify(this.defaultUser));
  showSpinner = false;

  action = '';

  ngOnInit(): void {
    //this.authService.homeService.disableServerSelection = true;
    this.formGrp.valueChanges.subscribe((e) => {
      this.authService.alert.clear();
      this.submited = false;
    });

    this.route.paramMap.subscribe((params) => {
      if (params.has('username')) {
        //existing user
        this.action = 'update';
        const username = params.get('username') ?? '';
        if (this.authService.userInRole(UserRoleEnum.Admin) || this.authService.loadedUser.username === username) {
          (async () => {
            try {
              this.loadedUser = await this.authService.getUser(username);
              console.log(this.loadedUser);
              this.onReset();
            } catch (err) {
              this.authService.alert.setError(err);
            }
          })();
        }
      } else {
        //new user
        this.action = 'new';
        this.loadedUser = JSON.parse(JSON.stringify(this.defaultUser));
        this.formGrp.get('username')?.enable();
        this.onReset();
      }
    });
  }

  ngOnDestroy(): void {
    //this.authService.homeService.disableServerSelection = false;
  }

  get roles() {
    const roles = this.formGrp.get('roles')?.value ?? [];
    // const r = roles.split(',') || [];
    return roles;
  }

  onCancel() {
    this.location.back();
  }

  onReset() {
    //this.formGrp.reset();

    this.formGrp.reset({
      username: this.loadedUser.username,
      firstName: this.loadedUser.firstName,
      lastName: this.loadedUser.lastName,
      roles: this.loadedUser.roles,
      password: this.loadedUser.password,
    });
    this.submited = false;
    this.authService.alert.clear();
  }

  async onSubmit() {
    if (this.formGrp.valid) {
      //  console.log(this.formGrp.value)
      this.submited = true;
      this.showSpinner = true;

      try {
        const frm = this.formGrp.getRawValue() as UserInterface;
        const frm1 = { username: frm.username.trim(), firstName: frm.firstName, lastName: frm.lastName, roles: frm.roles, password: frm.password };

        if (this.action === 'new') {
          const dup = this.authService.dataSourceLoadedUsers.data.findIndex((e) => e.username.toLowerCase() === frm1.username.toLowerCase());
          if (dup > -1) {
            throw `Username ${frm.username} already exists!`;
          }
        }

        if (this.action === 'update') {
          const res = await this.authService.updateUser(frm1);
        } else {
          const res = await this.authService.createUser(frm1);
        }
        this.showSpinner = false;
        this.authService.alert.setSuccess('Profile updated.');

        if (this.authService.loadedUser.username === this.loadedUser.username) {
          this.authService.loadedUser = frm;
        }
        //   console.log(this.authService.loadedUser);
        setTimeout(() => {
          this.elapse();
        }, 1500);
      } catch (err) {
        this.authService.alert.setError(err);
        this.submited = false;
      } finally {
        this.showSpinner = false;
      }
    }
  }

  elapse() {
    //  clearInterval(this.redirectTimer);
    //this.location.back();
    this.router.navigate(['/userbrowser']);
  }

  getErrorMessageFormGrp(field: string) {
    return '';
  }

  // onRoleChange(roles: string[]) {
  //   this.submited = false;
  //     this.formGrp.get('roles').setValue(roles);
  // }

  onStatusChange() {
    this.submited = false;
  }
}
