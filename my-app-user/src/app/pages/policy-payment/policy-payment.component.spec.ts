import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyPaymentComponent } from './policy-payment.component';

describe('PolicyPaymentComponent', () => {
  let component: PolicyPaymentComponent;
  let fixture: ComponentFixture<PolicyPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PolicyPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
