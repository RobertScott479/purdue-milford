import { AfterViewInit, Component, EventEmitter, OnInit, Output, Input, inject } from '@angular/core';

import { MatRipple, MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

interface IKeys {
  c: number[];
}

@Component({
  selector: 'app-keypad',
  templateUrl: './keypad.component.html',
  styleUrls: ['./keypad.component.scss'],
  imports: [MatButtonModule, MatRippleModule, MatIconModule, MatGridListModule],
})
export class KeypadComponent implements OnInit, AfterViewInit {
  @Input() set keyPress(key: string) {
    this.displayBox = key;
    this.pin = [...key];
  }
  @Output() LoginEvent: EventEmitter<string> = new EventEmitter();
  @Output() KeyPressEvent: EventEmitter<string> = new EventEmitter();

  displayBox = '';

  constructor() {}

  pin: string[] = [];

  keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  onKeyPress(key: string): void {
    this.KeyPressEvent.emit(key);

    if (key === 'X') {
      this.displayBox = this.displayBox.slice(0, -1);
    } else if (key === 'E') {
      if (this.displayBox) {
        this.LoginEvent.emit(this.displayBox);
      }
    } else {
      this.displayBox += key;
    }
  }
}
