import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeRoomsPage } from './free-rooms.page';

describe('FreeRoomsPage', () => {
  let component: FreeRoomsPage;
  let fixture: ComponentFixture<FreeRoomsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeRoomsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeRoomsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
