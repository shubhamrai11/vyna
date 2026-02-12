import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisionAddComponent } from './vision-add.component';

describe('VisionAddComponent', () => {
  let component: VisionAddComponent;
  let fixture: ComponentFixture<VisionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisionAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
