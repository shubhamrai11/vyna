import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromiseAddComponent } from './promise-add.component';

describe('PromiseAddComponent', () => {
  let component: PromiseAddComponent;
  let fixture: ComponentFixture<PromiseAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromiseAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromiseAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
