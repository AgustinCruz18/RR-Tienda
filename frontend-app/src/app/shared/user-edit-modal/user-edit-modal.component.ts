import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../interfaces/usuario.interface';

@Component({
  selector: 'app-user-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-edit-modal.component.html',
  styleUrl: './user-edit-modal.component.css'
})
export class UserEditModalComponent {
  @Input() usuario!: Usuario;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Usuario>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rol: ['', Validators.required]
    });
  }

  ngOnChanges() {
    if (this.usuario) {
      this.form.patchValue(this.usuario);
    }
  }

  guardar() {
    if (this.form.valid) {
      const usuarioActualizado: Usuario = {
        ...this.usuario,
        ...this.form.value
      };
      this.onSave.emit(usuarioActualizado);
    }
  }

  cerrar() {
    this.onClose.emit();
  }
}
