import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfectMatchIntroComponent } from './perfect-match-intro.component';

describe('PerfectMatchIntroComponent', () => {
  let component: PerfectMatchIntroComponent;
  let fixture: ComponentFixture<PerfectMatchIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfectMatchIntroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfectMatchIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
