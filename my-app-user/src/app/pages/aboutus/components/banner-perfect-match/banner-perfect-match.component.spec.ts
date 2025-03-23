import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerPerfectMatchComponent } from './banner-perfect-match.component';

describe('BannerPerfectMatchComponent', () => {
  let component: BannerPerfectMatchComponent;
  let fixture: ComponentFixture<BannerPerfectMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BannerPerfectMatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerPerfectMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
