import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogDetailComponent } from './blogdetail.component';

describe('BlogdetailComponent', () => {
  let component: BlogDetailComponent;
  let fixture: ComponentFixture<BlogDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
