// frontend-app/src/app/dashboard/gerente/productos-gerente/productos-gerente.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../../services/producto.service';
import { UploadService } from '../../../services/upload.service';
import { Producto } from '../../../interfaces/producto.interface';
import { StockEditModalComponent } from '../../../shared/stock-edit-modal/stock-edit-modal.component';


@Component({
  selector: 'app-productos-gerente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StockEditModalComponent],
  templateUrl: './productos-gerente.component.html',
  styleUrls: ['./productos-gerente.component.css']
})
export class ProductosGerenteComponent implements OnInit {
  // --- Estado del Componente ---
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  formProducto: FormGroup;
  formFiltros: FormGroup;

  // --- Banderas de Estado ---
  cargando = true;
  error = '';
  mensajeSubida = '';
  mostrarFormulario = false;
  modoEdicion = false;
  productoIdParaEditar: string | null = null;

  // Añade estas nuevas propiedades para controlar el modal
  mostrarModalStock = false;
  productoParaModal: Producto | null = null;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private uploadService: UploadService
  ) {
    // Formulario principal para crear o editar productos
    this.formProducto = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      unidadesPorPaquete: [1, [Validators.required, Validators.min(1)]],
      imagenUrl: [''],
      categoria: [''],
      genero: ['unisex', Validators.required]
    });

    // Formulario para los filtros de la tabla
    this.formFiltros = this.fb.group({
      query: [''],
      categoria: [''],
      genero: ['']
    });
  }

  ngOnInit() {
    this.obtenerProductos();

    // Escuchar cambios en los filtros para actualizar la tabla en tiempo real
    this.formFiltros.valueChanges.subscribe(() => {
      this.aplicarFiltros();
    });
  }

  // --- Gestión de Datos (Obtener, Filtrar, Eliminar) ---

  obtenerProductos() {
    this.cargando = true;
    this.productoService.obtenerProductos().subscribe({
      next: data => {
        this.productos = data;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: err => {
        this.error = 'Error al cargar los productos.';
        this.cargando = false;
      }
    });
  }

  aplicarFiltros() {
    const { query, categoria, genero } = this.formFiltros.value;
    const textoBusqueda = query.toLowerCase().trim();

    this.productosFiltrados = this.productos.filter(prod => {
      const coincideBusqueda = textoBusqueda === '' ||
        prod.nombre.toLowerCase().includes(textoBusqueda) ||
        prod.codigo.toLowerCase().includes(textoBusqueda);

      const coincideCategoria = categoria === '' || prod.categoria === categoria;
      const coincideGenero = genero === '' || prod.genero === genero;

      return coincideBusqueda && coincideCategoria && coincideGenero;
    });
  }

  eliminarProducto(id: string | undefined) {
    if (!id) return;
    if (!confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) return;

    this.productoService.eliminarProducto(id).subscribe({
      next: () => {
        alert('Producto eliminado correctamente.');
        this.obtenerProductos(); // Recargar la lista
      },
      error: err => alert('Error al eliminar el producto.')
    });
  }

  // --- Lógica del Formulario (Crear, Editar, Limpiar) ---

  prepararParaCrear() {
    this.limpiarFormulario(); // Soluciona el bug de estado
    this.mostrarFormulario = true;
  }

  prepararParaEditar(producto: Producto) {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.productoIdParaEditar = producto._id || null;

    this.formProducto.patchValue(producto);
    //this.formProducto.get('stock')?.setValue(0); // Para agregar nuevo stock si se desea
  }

  abrirModalStock(producto: Producto) {
    this.productoParaModal = producto;
    this.mostrarModalStock = true;
  }

  cerrarModalStock() {
    this.mostrarModalStock = false;
    this.productoParaModal = null;
  }

  guardarCambiosStock(event: { stockToAdd: number, newUnits: number, actualizarUnidades: boolean }) {
    if (!this.productoParaModal) return;

    const producto = this.productoParaModal;
    const stockActual = producto.stock;
    const unidadesDisponiblesActuales = producto.unidadesDisponibles;

    const nuevoStock = stockActual + event.stockToAdd;
    const nuevasUnidadesDisponibles = unidadesDisponiblesActuales + (event.stockToAdd * event.newUnits);

    const productoActualizado: any = {
      ...producto,
      stock: nuevoStock,
      unidadesDisponibles: nuevasUnidadesDisponibles
    };

    if (event.actualizarUnidades) {
      productoActualizado.unidadesPorPaquete = event.newUnits;
    }

    this.productoService.actualizarProducto(producto._id!, productoActualizado).subscribe({
      next: () => {
        alert('Stock actualizado correctamente.');
        this.obtenerProductos();
        this.cerrarModalStock();
      },
      error: (err) => alert(err.error?.msg || 'Error al actualizar el stock.')
    });
  }



  guardarProducto() {
    if (this.formProducto.invalid) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    const datosFormulario = this.formProducto.value;

    if (this.modoEdicion && this.productoIdParaEditar) {
      // --- Lógica para ACTUALIZAR un producto existente ---
      this.productoService.actualizarProducto(this.productoIdParaEditar, datosFormulario).subscribe({
        next: () => {
          alert('Producto actualizado correctamente.');
          this.obtenerProductos();
          this.limpiarFormulario();
        },
        error: (err) => alert(err.error?.msg || 'Error al actualizar el producto.')
      });
    } else {
      // --- Lógica para CREAR un nuevo producto ---
      this.productoService.crearProducto(datosFormulario).subscribe({
        next: () => {
          alert('Producto creado correctamente.');
          this.obtenerProductos();
          this.limpiarFormulario();
        },
        error: (err) => alert(err.error?.msg || 'Error al crear el producto. ¿El código ya existe?')
      });
    }
  }

  limpiarFormulario() {
    this.formProducto.reset({ unidadesPorPaquete: 1, genero: 'unisex', stock: 0, precio: 0 });
    this.modoEdicion = false;
    this.productoIdParaEditar = null;
    this.mostrarFormulario = false;
    this.mensajeSubida = '';
    this.error = '';
  }

  // --- Subida de Imágenes a Cloudinary ---

  archivoSeleccionado(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.mensajeSubida = 'Subiendo imagen...';
    this.uploadService.subirImagen(file).subscribe({
      next: (res) => {
        this.formProducto.controls['imagenUrl'].setValue(res.url);
        this.mensajeSubida = `Imagen subida con éxito.`;
        this.error = '';
      },
      error: (err) => {
        this.error = err.error?.msg || 'Error al subir la imagen.';
        this.mensajeSubida = '';
      }
    });
  }

  // --- Helpers ---
  get categoriasUnicas(): (string | undefined)[] {
    // La corrección es añadir .filter(Boolean) para eliminar los undefined
    return [...new Set(this.productos.map(p => p.categoria))].filter(Boolean);
  }
}