import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecuperacionService {
  private API_URL = environment.apiUrl + '/auth'; // Asegúrate de tener este endpoint

  constructor(private http: HttpClient) { }

  // 👉 Enviar email de recuperación
  solicitarReset(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/forgot-password`, { email });
  }

  // 👉 Cambiar la contraseña con el token
  resetPassword(data: { token: string, newPassword: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/reset-password`, data);
  }
}
