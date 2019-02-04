import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusMapPage } from './campus-map.page';

describe('CampusMapPage', () => {
  let component: CampusMapPage;
  let fixture: ComponentFixture<CampusMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampusMapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampusMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
