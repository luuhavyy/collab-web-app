import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyShippingComponent } from './policy-shipping.component';

describe('PolicyShippingComponent', () => {
  let component: PolicyShippingComponent;
  let fixture: ComponentFixture<PolicyShippingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PolicyShippingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
