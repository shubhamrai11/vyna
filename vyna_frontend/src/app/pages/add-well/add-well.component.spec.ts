import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWellComponent } from './add-well.component';

describe('AddWellComponent', () => {
  let component: AddWellComponent;
  let fixture: ComponentFixture<AddWellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
