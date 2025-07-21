//frontend-app/src/app/imagenes/upload-image/upload-image.component.ts
import { Component } from '@angular/core';
import { UploadService } from '../../services/upload.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.css'
})
export class UploadImageComponent {
  imagenUrl: string | null = null;
  mensaje: string = '';
  error: string = '';

  constructor(private uploadService: UploadService) { }

  archivoSeleccionado(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadService.subirImagen(file).subscribe({
        next: (res) => {
          this.imagenUrl = res.url;
          this.mensaje = res.msg;
          this.error = '';
        },
        error: (err) => {
          this.error = err.error?.msg || 'Error al subir la imagen.';
          this.mensaje = '';
        }
      });
    }
  }
}