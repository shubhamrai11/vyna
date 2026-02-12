import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentManagementAddComponent } from './content-management-add.component';

describe('ContentManagementAddComponent', () => {
  let component: ContentManagementAddComponent;
  let fixture: ComponentFixture<ContentManagementAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentManagementAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentManagementAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
