import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReportesVentasComponent } from '../gerente/reportes-ventas/reportes-ventas.component';
import { RegistrarVentaComponent } from '../gerente/registrar-venta/registrar-venta.component';
import { HistorialVentasComponent } from '../gerente/historial-ventas/historial-ventas.component';
import { ProductosGerenteComponent } from '../gerente/productos-gerente/productos-gerente.component';

@Component({
  selector: 'app-gerente-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ProductosGerenteComponent,
    RegistrarVentaComponent,
    HistorialVentasComponent,
    ReportesVentasComponent
  ],
  templateUrl: './gerente-dashboard.component.html',
  styleUrls: ['./gerente-dashboard.component.css'] // <-- acá plural
})
export class GerenteDashboardComponent {
  vista: 'productos' | 'ventas' | 'historial' | 'reportes' = 'productos';
}
