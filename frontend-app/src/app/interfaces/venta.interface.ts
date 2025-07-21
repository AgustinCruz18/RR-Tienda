import { Producto } from './producto.interface';
import { Usuario } from './usuario.interface';

export interface Venta {
    _id: string;
    producto: Producto;
    cantidad: number;
    total: number;
    precioUnitario?: number;
    comentario?: string;
    cliente?: string;
    registradaPor: Usuario;
    fecha: string;
    createdAt?: string;
    updatedAt?: string;
}
