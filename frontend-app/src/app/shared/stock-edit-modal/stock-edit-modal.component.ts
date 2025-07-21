import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto } from '../../interfaces/producto.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './stock-edit-modal.component.html',
  styleUrl: './stock-edit-modal.component.css'
})
export class StockEditModalComponent {
  @Input() producto: Producto | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{
    stockToAdd: number,
    newUnits: number,
    actualizarUnidades: boolean
  }>();

  formStock: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formStock = this.fb.group({
      stockToAdd: [0, [Validators.required, Validators.min(1)]],
      newUnits: [1, [Validators.required, Validators.min(1)]],
      actualizarUnidades: [false]
    });
  }

  ngOnChanges() {
    if (this.producto) {
      this.formStock.patchValue({
        newUnits: this.producto.unidadesPorPaquete
      });
    }
  }

  onSave() {
    if (this.formStock.valid) {
      this.save.emit(this.formStock.value);
    }
  }

  onClose() {
    this.close.emit();
  }
}
