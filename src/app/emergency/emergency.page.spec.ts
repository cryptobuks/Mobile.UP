import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyPage } from './emergency.page';

describe('EmergencyPage', () => {
  let component: EmergencyPage;
  let fixture: ComponentFixture<EmergencyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmergencyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
