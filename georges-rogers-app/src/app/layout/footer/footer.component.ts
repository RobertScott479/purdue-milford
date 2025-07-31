import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../home.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
})
export class FooterComponent implements OnInit {
  constructor(public homeService: HomeService) {}
  tmr: any;
  date: Date = new Date();

  ngOnInit(): void {
    this.tmr = setInterval(() => {
      this.date = new Date();
    }, 1000);
  }
}
