import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsAddComponent } from './contact-us-add.component';

describe('ContactUsAddComponent', () => {
  let component: ContactUsAddComponent;
  let fixture: ComponentFixture<ContactUsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactUsAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
