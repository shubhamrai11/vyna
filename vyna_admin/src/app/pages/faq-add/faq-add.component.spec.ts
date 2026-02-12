import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FAQADDComponent } from './faq-add.component';

describe('FAQADDComponent', () => {
  let component: FAQADDComponent;
  let fixture: ComponentFixture<FAQADDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FAQADDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FAQADDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
