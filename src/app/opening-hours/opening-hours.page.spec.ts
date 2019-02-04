import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningHoursPage } from './opening-hours.page';

describe('OpeningHoursPage', () => {
  let component: OpeningHoursPage;
  let fixture: ComponentFixture<OpeningHoursPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpeningHoursPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpeningHoursPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
