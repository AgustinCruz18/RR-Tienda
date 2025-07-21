import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  form: FormGroup;
  mensaje = '';
  error = '';
  token: string | null = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private http: HttpClient) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsIguales });

    this.token = this.route.snapshot.paramMap.get('token');
  }

  passwordsIguales(group: FormGroup): { [key: string]: boolean } | null {
    const pass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { noSonIguales: true };
  }

  enviarReset() {
    if (this.form.invalid) {
      this.error = 'Por favor completa el formulario correctamente.';
      this.mensaje = '';
      return;
    }

    if (!this.token) {
      this.error = 'Token inválido o inexistente.';
      this.mensaje = '';
      return;
    }

    const data = {
      token: this.token,
      newPassword: this.form.get('newPassword')?.value
    };

    this.http.post('http://localhost:5000/api/auth/reset-password', data).subscribe({
      next: (res: any) => {
        this.mensaje = res.msg || 'Contraseña cambiada correctamente.';
        this.error = '';
        this.form.reset();
      },
      error: (err) => {
        this.error = err.error?.msg || 'Error al cambiar la contraseña.';
        this.mensaje = '';
      }
    });
  }
}
