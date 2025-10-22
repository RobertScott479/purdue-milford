import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISSEvent } from './qc.model';

@Injectable({
  providedIn: 'root',
})
export class QcService {
  lastCheckIndex = 0;
  constructor() {}

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
