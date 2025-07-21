// src/app/dashboard/gerente/historial-ventas/historial-ventas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Venta } from '../../../interfaces/venta.interface';
import { VentaService } from '../../../services/venta.service';


@Component({
  selector: 'app-historial-ventas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-ventas.component.html',
  styleUrl: './historial-ventas.component.css'
})
export class HistorialVentasComponent implements OnInit {
  ventas: Venta[] = [];
  cargando = true;
  error = '';

  constructor(private ventaService: VentaService) { }

  ngOnInit(): void {
    this.ventaService.obtenerVentas().subscribe({
      next: (res) => {
        this.ventas = res;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar ventas.';
        this.cargando = false;
      }
    });
  }
}
