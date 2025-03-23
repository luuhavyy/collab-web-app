import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerPromotionComponent } from './banner-promotion.component';

describe('BannerPromotionComponent', () => {
  let component: BannerPromotionComponent;
  let fixture: ComponentFixture<BannerPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BannerPromotionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
