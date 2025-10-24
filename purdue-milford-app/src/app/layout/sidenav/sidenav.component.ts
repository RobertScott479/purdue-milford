import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink } from '@angular/router';
import { HomeService } from '../../home.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../users/login/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  standalone: true,
  imports: [RouterLink, MatListModule, MatCardModule, MatExpansionModule, MatExpansionModule, MatIconModule, CommonModule],
})
export class SidenavComponent {
  constructor(public homeService: HomeService, public authService: AuthService, private router: Router) {}

  toggleDarkMode() {
    this.homeService.isDarkMode.set(!this.homeService.isDarkMode());
  }

  logout() {
    //this.menuClicked();
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  login() {
    // this.menuClicked();
    this.router.navigate(['/login']);
  }
}
