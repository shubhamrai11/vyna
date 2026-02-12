import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InqueryComponent } from './inquery.component';

describe('InqueryComponent', () => {
  let component: InqueryComponent;
  let fixture: ComponentFixture<InqueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InqueryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InqueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
