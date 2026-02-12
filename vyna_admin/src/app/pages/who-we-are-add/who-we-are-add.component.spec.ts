import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoWeAreAddComponent } from './who-we-are-add.component';

describe('WhoWeAreAddComponent', () => {
  let component: WhoWeAreAddComponent;
  let fixture: ComponentFixture<WhoWeAreAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoWeAreAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhoWeAreAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
