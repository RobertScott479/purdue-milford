import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UserInterface, UserResInterface, UserRoleEnum, UsersInterface } from './auth-models';
import { Router } from '@angular/router';

import { ILoginUser } from '../user.model';

import { MatTab } from '@angular/material/tabs';
import { MatTableDataSource } from '@angular/material/table';

import { firstValueFrom } from 'rxjs';

import { LoginComponent } from './login.component';
import { MatDialog } from '@angular/material/dialog';
import { TrimlineService } from '../../reports/trimline/datasource/trimline.service';
import { AlertMessage } from '../../layout/alert/alert-message';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  dataSourceLoadedUsers = new MatTableDataSource<UserInterface>();
  // loadedUsers: UserInterface[] = [];
  loadedUser: UserInterface = { username: '', password: '', roles: [UserRoleEnum.Unknown] };
  isAuthenticated = false;
  roles: string[] = [UserRoleEnum.Admin, UserRoleEnum.Super, UserRoleEnum.User];
  alert = new AlertMessage();

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private httpClient: HttpClient, private router: Router, public trimlineService: TrimlineService, private dialog: MatDialog) {}

  InvokeLogin(): void {
    this.canExecute([], '');
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const userLogin: ILoginUser = { username: username, password: password };
      const host = this.trimlineService.selectedServerHost;
      const res = await firstValueFrom(this.httpClient.post<UserResInterface>(`${host}/api/users/loginuser`, userLogin, { observe: 'response' }));
      if (res && res.body) {
        if (res.status == 200) {
          //  console.log(res);
          this.loadedUser = res.body.user;
          // @ts-ignore
          this.loadedUser.roles = res.body.user.roles.split(',');
          this.isAuthenticated = true;
          return true;
        } else if (res.status == 404) {
          this.alert.setError('Invalid username or password!');
          return false;
        }
      }
      this.alert.setError(res.statusText);
      return false;
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.status == 404) {
        this.alert.setError('Invalid username or password!');
        return false;
      }
      this.alert.setError(err);
      return false;
    }
  }

  // async login(username: string, password: string): Promise<boolean> {
  //   try {
  //     const res = (await this.loadusers()) as UserResInterface;
  //     if (res.errorCode === '0') {
  //       const i = res.users.findIndex((x) => x.username.toLowerCase() === username && x.password === password);

  //       if (i > -1) {
  //         this.dataSourceLoadedUsers.data = res.users.map((e) => {
  //           // @ts-ignore
  //           e.roles = e.roles.split(',');
  //           return e;
  //         });
  //         this.loadedUser = this.dataSourceLoadedUsers.data[i];
  //         //  console.log(this.loadedUser);
  //         this.isAuthenticated = true;
  //         return true;
  //       } else {
  //         this.alert.setError('Invalid username or password!');
  //         return false;
  //       }
  //     } else {
  //       this.alert.setError(res.errorMessage);
  //     }
  //   } catch (err) {
  //     this.alert.setError(err.message);
  //     return false;
  //   }
  // }

  logout() {
    this.isAuthenticated = false;
    this.loadedUser = { username: '', password: '', roles: [UserRoleEnum.Unknown] };
  }

  canExecute(expectedRoles: any, returnUrl: string): boolean {
    const isInRole = this.loadedUser.roles.some((role) => expectedRoles.includes(role));

    if (!this.isAuthenticated || !isInRole) {
      const dialogRef = this.dialog.open(LoginComponent, {
        width: '480px',
        height: '400px',
        // data: returnUrl,
      });

      dialogRef.afterClosed().subscribe((isloggedIn) => {
        if (isloggedIn && returnUrl) {
          this.router.navigateByUrl(returnUrl);
        }
      });
      // this.router.navigate(['/home/login', returnUrl], {
      //   queryParams: {
      //     return: returnUrl,
      //     message: 'You do not have permission to access this resource',
      //   },
      // });
      return false;
    }
    return true;
  }

  userInRole(role: UserRoleEnum): boolean {
    return this.loadedUser.roles.indexOf(role) > -1;
  }

  deleteUser(userName: string) {
    // return new Promise((resolve, reject) => {
    //   this.loadedUsers = this.loadedUsers.filter((e) => e.username !== userName);
    //   resolve(this.loadedUsers);
    // });

    this.dataSourceLoadedUsers.data = this.dataSourceLoadedUsers.data.filter((e) => e.username !== userName);
    return this.saveusers();
  }

  createUser(newuser: UserInterface) {
    if (this.dataSourceLoadedUsers.data.findIndex((e) => e.username === newuser.username) === -1) {
      this.dataSourceLoadedUsers.data.push(newuser);
    } else {
      this.alert.setError(`username ${newuser.username} already exist.`);
    }

    return this.saveusers();
  }

  async updateUser(user: UserInterface) {
    const index = this.dataSourceLoadedUsers.data.findIndex((e) => e.username === user.username);
    if (index > -1) {
      this.dataSourceLoadedUsers.data[index] = user;
    }
    return await this.saveusers();
  }

  async getAllUsers(): Promise<UserInterface[]> {
    return new Promise((resolve, reject) => {
      resolve(this.dataSourceLoadedUsers.data);
    });
    //return this.httpClient.get<UserResInterface>('/api/users/getAllUsers', this.httpOptions);
  }

  async getUser(userName: string): Promise<UserInterface> {
    return new Promise((resolve, reject) => {
      const user = this.dataSourceLoadedUsers.data.find((e) => e.username === userName);
      if (user) {
        resolve(user);
      } else {
        reject(new Error(`User with username '${userName}' not found`));
      }
    });
  }

  saveusers() {
    const users = this.copyObject(this.dataSourceLoadedUsers.data);
    users.map((e: UserInterface) => {
      //@ts-ignore
      e.roles = e.roles.join(',');
      return e;
    });
    const host = this.trimlineService.selectedServerHost;
    return this.httpClient.post<UserInterface[]>(`${host}/api/users/saveusers`, { users: users }, this.httpOptions).toPromise();
  }

  loadusers() {
    const host = this.trimlineService.selectedServerHost;
    return this.httpClient.get<UsersInterface>(`${host}/api/users/loadusers`, this.httpOptions).toPromise();
  }

  copyObject(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }
}
