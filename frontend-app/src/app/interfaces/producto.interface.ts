export interface Producto {
    _id?: string;
    nombre: string;
    descripcion?: string;
    precio: number;
    stock: number;  // paquetes
    unidadesPorPaquete: number;
    unidadesDisponibles: number;
    codigo: string;
    imagenUrl?: string;
    categoria?: string;
    genero?: 'hombre' | 'mujer' | 'unisex';
}
