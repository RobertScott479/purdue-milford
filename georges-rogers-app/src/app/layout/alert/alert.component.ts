import { Component, input, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AlertMessage, AlertTypeEnum } from './alert-message';
import { CommonModule, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
// import { AlertMessage, AlertTypeEnum } from '../alert-message';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
})
export class AlertComponent implements OnInit {
  @Input() alert: AlertMessage = new AlertMessage();
  @Input() alertHidden = false;
  //@Input() dismissible: boolean = false;

  @Output() ErrorAcknowledgedEvent: EventEmitter<string> = new EventEmitter();

  constructor() {}

  onErrorAck() {
    this.ErrorAcknowledgedEvent.emit();
    this.alert && this.alert.clear();
  }

  ngOnInit(): void {}
}
