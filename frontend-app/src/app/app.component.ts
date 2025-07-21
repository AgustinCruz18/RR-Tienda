import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators'; // <- IMPORTAR ESTO
import { LoginComponent } from "./auth/login/login.component";
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend-app';
  isLoginPage = false;

  constructor(private router: Router) { }

  ngOnInit() {
    // Escuchar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Ocultar navbar en la página de login
      this.isLoginPage = event.url === '/login';
    });
  }
}