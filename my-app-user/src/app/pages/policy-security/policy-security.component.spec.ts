import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicySecurityComponent } from './policy-security.component';

describe('PolicySecurityComponent', () => {
  let component: PolicySecurityComponent;
  let fixture: ComponentFixture<PolicySecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PolicySecurityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicySecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
