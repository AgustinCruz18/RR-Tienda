import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  form: FormGroup;
  mensaje = '';
  error = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  enviarSolicitud() {
    if (this.form.invalid) return;

    const email = this.form.value.email;

    this.http.post('http://localhost:5000/api/auth/forgot-password', { email }).subscribe({
      next: (res: any) => {
        this.mensaje = res.msg || 'Se enviaron las instrucciones a tu email.';
        this.error = '';
      },
      error: (err) => {
        this.error = err.error.msg || 'Error al enviar solicitud.';
        this.mensaje = '';
      }
    });
  }
}
