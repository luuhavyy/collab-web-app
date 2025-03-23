import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsIntroComponent } from './about-us-intro.component';

describe('AboutUsIntroComponent', () => {
  let component: AboutUsIntroComponent;
  let fixture: ComponentFixture<AboutUsIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutUsIntroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutUsIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
