import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  usuario: any;

  constructor(private auth: AuthService, private router: Router) {
    this.usuario = this.auth.getUser();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}