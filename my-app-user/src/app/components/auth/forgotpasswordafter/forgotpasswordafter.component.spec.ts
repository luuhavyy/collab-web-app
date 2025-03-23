import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordAfterComponent } from './forgotpasswordafter.component';

describe('ForgotpasswordafterComponent', () => {
  let component: ForgotPasswordAfterComponent;
  let fixture: ComponentFixture<ForgotPasswordAfterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordAfterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordAfterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
