// registrar-venta.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../interfaces/producto.interface';
import { VentaService } from '../../../services/venta.service';
import { ProductoService } from '../../../services/producto.service';

@Component({
  selector: 'app-registrar-venta',
  standalone: true,
  templateUrl: './registrar-venta.component.html',
  styleUrl: './registrar-venta.component.css',
  imports: [CommonModule, ReactiveFormsModule]
})
export class RegistrarVentaComponent implements OnInit {
  form!: FormGroup;
  productos: Producto[] = [];
  mensaje = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private ventaService: VentaService,
    private productoService: ProductoService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      producto: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      cliente: [''],
      comentario: ['']
    });

    this.productoService.obtenerProductos().subscribe({
      next: (productos) => {
        console.log('Productos cargados:', productos);
        this.productos = productos;
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
        this.error = 'Error al cargar productos';
      }
    });
  }

  // Getter para obtener el producto seleccionado
  get productoSeleccionado(): Producto | null {
    const productoId = this.form.get('producto')?.value;
    return this.productos.find(p => p._id === productoId) || null;
  }

  // Getter para obtener las unidades disponibles
  get unidadesDisponibles(): number {
    const producto = this.productoSeleccionado;
    if (!producto) return 0;

    // Usar directamente unidadesDisponibles ya que es requerido en la interfaz
    return producto.unidadesDisponibles;
  }

  // Método para calcular el total de la venta
  calcularTotal(): number {
    const producto = this.productoSeleccionado;
    const cantidad = this.form.get('cantidad')?.value || 0;
    return (producto?.precio || 0) * cantidad;
  }

  // Método original mantenido por compatibilidad (opcional)
  getProductoSeleccionado(): Producto | null {
    return this.productoSeleccionado;
  }

  registrarVenta() {
    if (this.form.invalid) return;

    const cantidad = this.form.value.cantidad;
    const productoId = this.form.value.producto;
    const productoSeleccionado = this.productos.find(p => p._id === productoId);

    if (!productoSeleccionado) {
      this.error = 'Producto inválido';
      return;
    }

    const unidadesDisponibles = productoSeleccionado.unidadesDisponibles;

    if (cantidad > unidadesDisponibles) {
      this.error = `No hay suficientes unidades disponibles. Máximo: ${unidadesDisponibles}`;
      return;
    }

    this.ventaService.registrarVenta(this.form.value).subscribe({
      next: (res) => {
        this.mensaje = res.msg;
        this.error = '';
        this.form.reset({ cantidad: 1 });
      },
      error: (err) => {
        this.error = err.error?.msg || 'Error al registrar venta';
        this.mensaje = '';
      }
    });
  }
}