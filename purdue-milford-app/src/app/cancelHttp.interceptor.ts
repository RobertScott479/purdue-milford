import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivationEnd, NavigationStart, Router } from '@angular/router';
import { HttpCancelService } from './httpcancel.service';

@Injectable()
export class CancelHttpInterceptor implements HttpInterceptor {
  constructor(private httpCancelService: HttpCancelService) {}

  intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return next.handle(req).pipe(takeUntil(this.httpCancelService.onCancelPendingRequests()));
  }
}
