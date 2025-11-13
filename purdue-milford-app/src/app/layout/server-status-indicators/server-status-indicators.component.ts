import { Component, Input } from '@angular/core';
import { ServerMapInterface } from '../../serverMap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-server-status-indicators',
  imports: [CommonModule],
  templateUrl: './server-status-indicators.component.html',
  styleUrl: './server-status-indicators.component.scss',
})
export class ServerStatusIndicatorsComponent {
  @Input() serverList: ServerMapInterface[] = [];
}
