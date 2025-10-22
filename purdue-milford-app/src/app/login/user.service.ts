import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserInterface } from './user-models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  loadedUsers: UserInterface[] = [];
  loadedUser: UserInterface = { username: '', password: '', type: '' };
  alertMessage = '';

  constructor(private httpClient: HttpClient) { }


  loadUsers() {
    this.httpClient.get('../assets/users.json').subscribe((res: UserInterface[]) => {
      // if(res.errorCode === '0') {
      this.loadedUsers = res;
      // } else {
      //   this.alertMessage = res.errorMessage;
      // }
    }, (error: HttpErrorResponse) => {
      this.alertMessage = error.message;
    });
  }

}
