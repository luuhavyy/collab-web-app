import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfectMatchStepComponent } from './perfect-match-step.component';

describe('PerfectMatchStepComponent', () => {
  let component: PerfectMatchStepComponent;
  let fixture: ComponentFixture<PerfectMatchStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfectMatchStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfectMatchStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
