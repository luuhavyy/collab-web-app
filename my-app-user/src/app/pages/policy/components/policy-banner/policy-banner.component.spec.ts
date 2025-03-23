import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyBannerComponent } from './policy-banner.component';

describe('PolicyBannerComponent', () => {
  let component: PolicyBannerComponent;
  let fixture: ComponentFixture<PolicyBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PolicyBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
