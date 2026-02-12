import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsBannerAddComponent } from './cms-banner-add.component';

describe('CmsBannerAddComponent', () => {
  let component: CmsBannerAddComponent;
  let fixture: ComponentFixture<CmsBannerAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmsBannerAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsBannerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
