import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardAddComponent } from './award-add.component';

describe('AwardAddComponent', () => {
  let component: AwardAddComponent;
  let fixture: ComponentFixture<AwardAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwardAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwardAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
