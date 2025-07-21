import { Routes } from '@angular/router';
import { GerenteDashboardComponent } from './dashboard/gerente-dashboard/gerente-dashboard.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { RoleGuard } from './guards/auth.guard';
import { PortadaProductosComponent } from './public/portada-productos.component';
import { ForgotPasswordComponent } from './recuperacion-contrasena/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './recuperacion-contrasena/reset-password/reset-password.component';


export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'inicio', component: PortadaProductosComponent },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [RoleGuard], data: { rol: 'admin' } },
    { path: 'gerente', component: GerenteDashboardComponent, canActivate: [RoleGuard], data: { rol: 'gerente' } },
    {
        path: 'recuperar-contrasena',
        loadComponent: () => import('./recuperacion-contrasena/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
    },
    {
        path: 'resetear-contrasena/:token',
        loadComponent: () => import('./recuperacion-contrasena/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
    },
    { path: '**', redirectTo: 'inicio' },
];