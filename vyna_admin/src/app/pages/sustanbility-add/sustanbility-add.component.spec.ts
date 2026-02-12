import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SustanbilityAddComponent } from './sustanbility-add.component';

describe('SustanbilityAddComponent', () => {
  let component: SustanbilityAddComponent;
  let fixture: ComponentFixture<SustanbilityAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SustanbilityAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SustanbilityAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
