import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomplanPage } from './roomplan.page';

describe('RoomplanPage', () => {
  let component: RoomplanPage;
  let fixture: ComponentFixture<RoomplanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomplanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomplanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
