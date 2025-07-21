import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockEditModalComponent } from './stock-edit-modal.component';

describe('StockEditModalComponent', () => {
  let component: StockEditModalComponent;
  let fixture: ComponentFixture<StockEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
