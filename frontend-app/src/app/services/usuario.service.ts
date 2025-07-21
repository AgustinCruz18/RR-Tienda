import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service'; // 👈 para usar el token

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private API = environment.apiUrl + '/usuarios';

  constructor(private http: HttpClient, private auth: AuthService) { }

  getUsuarios(): Observable<Usuario[]> {
    const headers = this.agregarAuthHeader();
    return this.http.get<Usuario[]>(this.API, { headers });
  }

  actualizarUsuario(id: string, data: Partial<Usuario>): Observable<any> {
    const headers = this.agregarAuthHeader();
    return this.http.put(`${this.API}/${id}`, data, { headers });
  }

  eliminarUsuario(id: string): Observable<any> {
    const headers = this.agregarAuthHeader();
    return this.http.delete(`${this.API}/${id}`, { headers });
  }

  private agregarAuthHeader(): HttpHeaders {
    const token = this.auth.getToken();
    if (token) {
      return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }
    return new HttpHeaders();
  }
}
