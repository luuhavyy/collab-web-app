import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCompleteComponent } from './ordercomplete.component';

describe('OrdercompleteComponent', () => {
  let component: OrderCompleteComponent;
  let fixture: ComponentFixture<OrderCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderCompleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
