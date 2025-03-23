import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqServiceComponent } from './faq-service.component';

describe('FaqServiceComponent', () => {
  let component: FaqServiceComponent;
  let fixture: ComponentFixture<FaqServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FaqServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
