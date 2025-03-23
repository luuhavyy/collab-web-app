import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfectMatchComponent } from './perfectmatch.component';

describe('PerfectMatchComponent', () => {
  let component: PerfectMatchComponent;
  let fixture: ComponentFixture<PerfectMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfectMatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfectMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
