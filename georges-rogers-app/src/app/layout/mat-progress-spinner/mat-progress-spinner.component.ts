import {CommonModule} from '@angular/common';
import {Component, Input, OnChanges, OnInit, signal, SimpleChanges} from '@angular/core';
import {MatProgressBar, MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-mat-progress-spinner',
  standalone: true,
  imports: [MatProgressBarModule, CommonModule, MatProgressBar],
  templateUrl: './mat-progress-spinner.component.html',
  styleUrls: ['./mat-progress-spinner.component.scss']
})
export class MatProgressSpinnerComponent implements OnChanges {
  constructor() {}

  @Input() value: number = 0;
  @Input() mode: 'indeterminate' | 'determinate' | 'query' | 'buffer' = 'indeterminate';
  @Input() color: string = 'primary';
  @Input() disabled: boolean = false;
  @Input() delay: number = 700;
  @Input() visible: boolean = false;
  showSpinner = signal(false);
  tmr: any;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      //&& !changes['visible'].firstChange)
      if (this.visible) {
        this.tmr = setTimeout(() => {
          this.showSpinner.set(true);
        }, this.delay);
      } else {
        clearTimeout(this.tmr);
        this.showSpinner.set(false);
      }
    }
  }
}
