import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutAddComponent } from './about-add.component';

describe('AboutAddComponent', () => {
  let component: AboutAddComponent;
  let fixture: ComponentFixture<AboutAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
