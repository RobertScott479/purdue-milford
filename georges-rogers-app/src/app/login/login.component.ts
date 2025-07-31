import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserInterface } from './user-models';
import { UserService } from './user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
})
export class LoginComponent implements OnInit {
  constructor(public router: Router, private userService: UserService, private route: ActivatedRoute, private httpClient: HttpClient) {}

  formGrp = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  alertMessage = '';

  ngOnInit(): void {
    this.logout();
  }

  logout() {
    this.userService.loadedUser = { username: '', password: '', type: '' };
  }

  onSubmit() {
    this.httpClient.get<UserInterface[]>('../assets/users.json').subscribe(
      (res) => {
        this.userService.loadedUsers = res;

        const username = this.formGrp.get('username')?.value?.toString().toLowerCase();
        const password = this.formGrp.controls.password.value;

        const i = this.userService.loadedUsers.findIndex((x) => x.username.toLowerCase() === username && x.password === password);

        if (i > -1) {
          this.userService.loadedUser = this.userService.loadedUsers[i];

          this.router.navigate(['/home']);
        } else {
          this.alertMessage = 'Invalid username or password!';
        }
      },
      (err: HttpErrorResponse) => {
        this.alertMessage = err.message;
      }
    );
  }
}
