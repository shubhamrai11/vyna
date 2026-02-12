import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SustanbilityComponent } from './sustanbility.component';

describe('SustanbilityComponent', () => {
  let component: SustanbilityComponent;
  let fixture: ComponentFixture<SustanbilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SustanbilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SustanbilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
