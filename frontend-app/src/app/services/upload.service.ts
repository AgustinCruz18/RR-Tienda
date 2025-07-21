import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private baseUrl = 'http://localhost:5000/api';  // Cambiar si es otro backend

  constructor(private http: HttpClient) { }

  subirImagen(file: File) {
    const formData = new FormData();
    formData.append('imagen', file);

    return this.http.post<{ msg: string; url: string }>(`${this.baseUrl}/upload`, formData);
  }
}
