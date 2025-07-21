import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Producto } from '../../../interfaces/producto.interface';
import { Venta } from '../../../interfaces/venta.interface';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-reportes-ventas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './reportes-ventas.component.html',
  styleUrl: './reportes-ventas.component.css'
})
export class ReportesVentasComponent implements OnInit {
  productos: Producto[] = [];
  ventasFiltradas: Venta[] = [];
  totalVentas: number = 0;
  form: FormGroup;
  error: string = '';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      productoId: [''],
      desde: [''],
      hasta: ['']
    });
  }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos() {
    const headers = {
      Authorization: `Bearer ${this.auth.getToken()}`
    };

    this.http.get<Producto[]>('http://localhost:5000/api/productos', { headers }).subscribe({
      next: (productos) => this.productos = productos,
      error: (err) => {
        console.error('Error al obtener productos', err);
        this.error = 'Error al obtener productos';
      }
    });
  }

  filtrarVentas() {
    const { productoId, desde, hasta } = this.form.value;
    let params = new HttpParams();

    if (productoId) params = params.set('productoId', productoId);
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);

    const headers = {
      Authorization: `Bearer ${this.auth.getToken()}`
    };

    this.http.get<Venta[]>('http://localhost:5000/api/ventas/filtro', { params, headers }).subscribe({
      next: (ventas) => {
        this.ventasFiltradas = ventas;
        this.totalVentas = ventas.reduce((acc, v) => acc + v.total, 0);
        this.error = '';
      },
      error: (err) => {
        console.error('Error al filtrar ventas', err);
        this.error = 'Error al filtrar ventas';
      }
    });
  }
}
