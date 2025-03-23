import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqBannerComponent } from './faq-banner.component';

describe('FaqBannerComponent', () => {
  let component: FaqBannerComponent;
  let fixture: ComponentFixture<FaqBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FaqBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
