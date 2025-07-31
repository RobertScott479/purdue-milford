import { HttpErrorResponse } from '@angular/common/http';
import { signal } from '@angular/core';

export enum AlertTypeEnum {
  Error = 'error',
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Dark = 'dark',
  Light = 'light',
  Unknown = '',
}

// export interface MessageInterface {
//   message: string;
//   type: AlertTypeEnum;
// }

export class AlertMessage {
  message = signal<string>('');
  type = signal<AlertTypeEnum>(AlertTypeEnum.Unknown);

  constructor() {}

  set(message: any, alertType: AlertTypeEnum) {
    this.message.set(this.getErrorMessage(message));
    this.type.set(alertType);
  }

  setError(message: any) {
    this.set(message, AlertTypeEnum.Error);
  }

  setInfo(message: any) {
    this.set(message, AlertTypeEnum.Info);
  }

  setSuccess(message: any) {
    this.set(message, AlertTypeEnum.Success);
  }

  async setSuccessAync(message: any, delay: number = 5000) {
    this.set(message, AlertTypeEnum.Success);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  setWarning(message: any) {
    this.set(message, AlertTypeEnum.Warning);
  }

  setLight(message: any) {
    this.set(message, AlertTypeEnum.Light);
  }

  setDark(message: any) {
    this.set(message, AlertTypeEnum.Dark);
  }

  hasAlert(): boolean {
    return this.message() != '';
  }

  clear() {
    this.message.set('');
    this.type.set(AlertTypeEnum.Unknown);
  }

  getErrorMessage(error: any): string {
    let errMessage = '';
    if (error instanceof HttpErrorResponse) {
      errMessage = error.message;
    } else if (error instanceof Error) {
      errMessage = error.message;
    } else if (typeof error === 'string') {
      errMessage = error;
    } else {
      errMessage = error?.toString() ?? '';
    }
    return errMessage;
  }
}
