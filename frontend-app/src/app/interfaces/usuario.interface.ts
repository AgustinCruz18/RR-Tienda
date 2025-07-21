//frontend-app/src/app/interfaces/usuario.interface.ts
export interface Usuario {
    _id?: string;
    nombre: string;
    apellido: string;
    email: string;
    rol: 'admin' | 'gerente' | 'cliente';
}
