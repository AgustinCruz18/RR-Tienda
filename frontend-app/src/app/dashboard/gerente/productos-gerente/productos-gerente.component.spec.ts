import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosGerenteComponent } from './productos-gerente.component';

describe('ProductosGerenteComponent', () => {
  let component: ProductosGerenteComponent;
  let fixture: ComponentFixture<ProductosGerenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosGerenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosGerenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
