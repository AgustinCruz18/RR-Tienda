//frontend-app/src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const rolRequerido = route.data['rol']; // 👈 viene desde la ruta

    const usuario = auth.getUser();

    if (!usuario || usuario.rol !== rolRequerido) {
        router.navigate(['/login']);
        return false;
    }

    return true;
};
