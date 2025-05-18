import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterModule, RouterOutlet, NgIf],
  standalone: true
})
export class AppComponent {
  title = 'Digital Banking';

  constructor(public authService: AuthService, private router: Router) {}

  handleLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
