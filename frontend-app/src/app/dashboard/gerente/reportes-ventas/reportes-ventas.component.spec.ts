import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesVentasComponent } from './reportes-ventas.component';

describe('ReportesVentasComponent', () => {
  let component: ReportesVentasComponent;
  let fixture: ComponentFixture<ReportesVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesVentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
