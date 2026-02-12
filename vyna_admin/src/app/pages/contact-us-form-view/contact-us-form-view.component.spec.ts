import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsFormViewComponent } from './contact-us-form-view.component';

describe('ContactUsFormViewComponent', () => {
  let component: ContactUsFormViewComponent;
  let fixture: ComponentFixture<ContactUsFormViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactUsFormViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
