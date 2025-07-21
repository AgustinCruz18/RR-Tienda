import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importar FormsModule para ngModel
import { Producto } from '../interfaces/producto.interface';

@Component({
  selector: 'app-portada-productos',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule], // Asegúrate de incluir FormsModule
  templateUrl: './portada-productos.component.html',
  styleUrl: './portada-productos.component.css'
})
export class PortadaProductosComponent implements OnInit {

  productos: Producto[] = [];
  productosFiltrados: Producto[] = []; // Lista de productos después de aplicar filtros
  loading = true;
  error: string | null = null;
  imagenAmpliadaUrl: string | null = null; // Variable para la URL de la imagen ampliada

  // Variables para los filtros
  busqueda = ''; // Este campo ahora buscará por nombre Y categoría
  categoriaSeleccionada = ''; // Para el select de categoría (se mantiene)
  // categoriaBusquedaTexto ya no es necesaria como propiedad separada
  generoSeleccionado = '';

  private apiUrl = 'http://localhost:5000/api/productos';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.cargarProductos();
  }

  /**
   * Carga los productos desde la API y aplica los filtros iniciales.
   */
  cargarProductos() {
    this.loading = true;
    this.error = null;

    this.http.get<Producto[]>(this.apiUrl).subscribe({
      next: (res) => {
        this.productos = res;
        this.aplicarFiltros(); // Aplica los filtros tan pronto como se cargan los productos
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'No se pudieron cargar los productos. Revisa la conexión con el servidor.';
        this.loading = false;
      }
    });
  }

  /**
   * Vuelve a cargar los productos desde la API.
   */
  recargarProductos() {
    this.cargarProductos();
  }

  /**
   * Aplica los filtros de búsqueda, categoría y género a la lista de productos.
   * Se llama cada vez que cambian los valores de los filtros.
   */
  aplicarFiltros() {
    this.productosFiltrados = this.productos.filter(p => {
      const busquedaLower = this.busqueda.toLowerCase();

      // Filtro combinado por nombre y categoría de texto
      // Un producto coincide si su nombre O su categoría incluye el texto de búsqueda
      const matchNombreOCategoriaTexto = busquedaLower === '' ||
        p.nombre.toLowerCase().includes(busquedaLower) ||
        (p.categoria && p.categoria.toLowerCase().includes(busquedaLower));

      // Filtro por categoría (select) - se mantiene para la selección por lista
      const matchCategoriaSelect = this.categoriaSeleccionada === '' || p.categoria === this.categoriaSeleccionada;

      // Filtro por género
      const matchGenero = this.generoSeleccionado === '' || p.genero === this.generoSeleccionado;

      // El producto debe coincidir con TODOS los filtros activos
      return matchNombreOCategoriaTexto && matchCategoriaSelect && matchGenero;
    });
  }

  /**
   * Restablece todos los filtros a sus valores por defecto y vuelve a aplicar los filtros.
   */
  limpiarFiltros() {
    this.busqueda = ''; // Solo necesitas reiniciar este campo
    this.categoriaSeleccionada = '';
    this.generoSeleccionado = '';
    this.aplicarFiltros(); // Aplica los filtros después de limpiar
  }

  /**
   * Obtiene una lista de categorías únicas de los productos disponibles.
   * Se usa para poblar el dropdown de categorías.
   */
  get categoriasUnicas(): string[] {
    // Filtra para asegurar que solo se incluyan categorías definidas (no undefined o null)
    return [...new Set(this.productos.map(p => p.categoria).filter(Boolean))] as string[];
  }

  /**
   * Obtiene una lista de géneros únicos de los productos disponibles.
   * Se usa para poblar el dropdown de géneros.
   */
  get generosUnicos(): string[] {
    // Filtra para asegurar que solo se incluyan géneros definidos (no undefined o null)
    return [...new Set(this.productos.map(p => p.genero).filter(Boolean))] as string[];
  }

  /**
   * Abre el modal con la imagen ampliada.
   * @param imageUrl La URL de la imagen a mostrar en el modal.
   */
  abrirModal(imageUrl: string) {
    this.imagenAmpliadaUrl = imageUrl;
  }

  /**
   * Cierra el modal de la imagen ampliada.
   */
  cerrarModal() {
    this.imagenAmpliadaUrl = null;
  }
}