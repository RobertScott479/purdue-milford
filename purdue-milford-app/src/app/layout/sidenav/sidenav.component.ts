import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { HomeService } from '../../home.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  standalone: true,
  imports: [RouterLink, MatListModule, MatCardModule, MatExpansionModule, MatExpansionModule, MatIconModule],
})
export class SidenavComponent {
  constructor(public homeService: HomeService) {}

  toggleDarkMode() {
    this.homeService.isDarkMode.set(!this.homeService.isDarkMode());
  }
}
