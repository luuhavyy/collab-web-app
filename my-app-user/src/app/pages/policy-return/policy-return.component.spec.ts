import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyReturnComponent } from './policy-return.component';

describe('PolicyReturnComponent', () => {
  let component: PolicyReturnComponent;
  let fixture: ComponentFixture<PolicyReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PolicyReturnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
