import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISSEvent } from './qc.model';
import { EmployeeInterface } from '../employees/employee.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class QcService {
  lastCheckIndex = 0;
  timeoutDelay = 5000;
  activeChecker: EmployeeInterface = { cutter_number: 0, name: '', role: '', shift: 0, enabled: false };
  constructor(public httpClient: HttpClient) {}

  openEventSource(url: string): Observable<any> {
    return new Observable<MessageEvent>((observer) => {
      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        const payload: ISSEvent = { event: 'message', data: event.data };
        observer.next(payload as any);
      };

      // eventSource.addEventListener('check', (event) => {
      //  const payload: ISSEvent = {event: 'check', data: event.data};
      //  observer.next(payload as any);
      // });

      // eventSource.addEventListener('weight', (event) => {
      //   const payload: ISSEvent = {event: 'weight', data: event.data};
      //   observer.next(payload as any);
      // });

      eventSource.onerror = (event) => {
        observer.error(event);
        eventSource.close();
      };

      return () => eventSource.close();
    });
  }
}
