import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InqueryViewComponent } from './inquery-view.component';

describe('InqueryViewComponent', () => {
  let component: InqueryViewComponent;
  let fixture: ComponentFixture<InqueryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InqueryViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InqueryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
