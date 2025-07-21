// venta.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Venta } from '../interfaces/venta.interface';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = 'http://localhost:5000/api/ventas';

  constructor(private http: HttpClient, private auth: AuthService) { }

  private getHeaders() {
    const token = this.auth.getToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }

  obtenerVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl, this.getHeaders());
  }

  registrarVenta(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, this.getHeaders());
  }
}