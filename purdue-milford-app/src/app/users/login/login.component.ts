import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserInterface, UserRoleEnum } from './auth-models';
import { AuthService } from './auth.service';

import { ThisReceiver } from '@angular/compiler';
import { CommonModule, Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertComponent } from '../../layout/alert/alert.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, AlertComponent],
})
export class LoginComponent implements OnInit {
  //@ViewChild('username') usernameField: ElementRef;

  formGrp = new UntypedFormGroup({
    username: new UntypedFormControl('', Validators.required),
    password: new UntypedFormControl('', Validators.required),
  });

  //return = '/home';
  // alertMessage = '';
  dialogRef = inject<MatDialogRef<LoginComponent>>(MatDialogRef);
  //return = inject<string>(MAT_DIALOG_DATA);

  constructor(public router: Router, public authService: AuthService, private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    this.authService.logout();
    this.authService.alert.setInfo('This feature requires authentication. Please log in to continue.');
    // this.route.queryParams.subscribe((params) => {
    //   this.return = params['return'] || '/home';
    //   this.authService.alert.setError(params['message'] || '');
    // });
  }

  async onSubmit() {
    const username = this.formGrp.get('username')?.value;
    const password = this.formGrp.get('password')?.value;
    if (!username || !password) {
      this.authService.alert.setError('Username and password are required!');
      return;
    }
    const loggedIn = await this.authService.login(username, password);
    if (loggedIn) {
      this.dialogRef.close(true);
    }
  }

  onCancel() {
    // this.router.navigateByUrl(this.return);
    //this.location.back();
    this.dialogRef.close(false);
  }
}
