import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { UserEditModalComponent } from '../../shared/user-edit-modal/user-edit-modal.component';
import { Usuario } from '../../interfaces/usuario.interface';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, UserEditModalComponent], // Agregar UserEditModalComponent
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = true;
  modalAbierto = false;
  usuarioSeleccionado!: Usuario;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  eliminarUsuario(id: string | undefined) {
    if (!id) {
      alert('ID de usuario no definido.');
      return;
    }
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    this.usuarioService.eliminarUsuario(id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(u => u._id !== id);
      },
      error: () => alert('Error al eliminar el usuario')
    });
  }

  abrirModal(usuario: Usuario) {
    this.usuarioSeleccionado = { ...usuario }; // Crear copia para evitar modificar original
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  actualizarUsuario(usuario: Usuario) {
    if (!usuario._id) {
      alert('ID de usuario no definido.');
      return;
    }
    this.usuarioService.actualizarUsuario(usuario._id, usuario).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cerrarModal();
      },
      error: () => alert('Error al actualizar el usuario')
    });
  }
}
