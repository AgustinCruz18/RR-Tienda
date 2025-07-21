//frontend-app/src/app/auth/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private API = environment.apiUrl + '/auth';

    constructor(private http: HttpClient) { }

    login(data: { email: string; password: string }): Observable<any> {
        return this.http.post(`${this.API}/login`, data);
    }

    logout() {
        localStorage.clear();
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getUser() {
        return JSON.parse(localStorage.getItem('user') || '{}');
    }

    isLoggedIn() {
        return !!this.getToken();
    }

    isAdmin() {
        return this.getUser()?.rol === 'admin';
    }

    isGerente() {
        return this.getUser()?.rol === 'gerente';
    }
}
