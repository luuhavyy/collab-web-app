import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsServiceComponent } from './about-us-service.component';

describe('AboutUsServiceComponent', () => {
  let component: AboutUsServiceComponent;
  let fixture: ComponentFixture<AboutUsServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutUsServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutUsServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
