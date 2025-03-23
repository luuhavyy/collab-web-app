import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfectMatchBannerComponent } from './perfect-match-banner.component';

describe('PerfectMatchBannerComponent', () => {
  let component: PerfectMatchBannerComponent;
  let fixture: ComponentFixture<PerfectMatchBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfectMatchBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfectMatchBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
