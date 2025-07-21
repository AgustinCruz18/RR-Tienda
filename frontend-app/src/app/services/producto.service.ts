// frontend-app/src/app/services/producto.service.ts
// (Agregar este método dentro de la clase ProductoService)

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Producto } from '../interfaces/producto.interface'; // Importa la interfaz

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private API = 'http://localhost:5000/api/productos';

  constructor(private http: HttpClient, private auth: AuthService) { }

  private getHeaders() {
    const token = this.auth.getToken();
    return token ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) } : {}; // [cite: 238]
  }

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API, this.getHeaders());
  }

  crearProducto(producto: Partial<Producto>): Observable<any> {
    return this.http.post(this.API, producto, this.getHeaders());
  }

  // MÉTODO NUEVO/ACTUALIZADO: para editar un producto completo
  actualizarProducto(id: string, producto: Partial<Producto>): Observable<any> {
    return this.http.put(`${this.API}/${id}`, producto, this.getHeaders());
  }

  eliminarProducto(id: string): Observable<any> {
    return this.http.delete(`${this.API}/${id}`, this.getHeaders());
  }

  crearOActualizarPorCodigo(producto: any): Observable<any> {
    return this.http.post(`${this.API}/codigo`, producto, this.getHeaders());
  }
}