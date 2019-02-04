import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonSearchPage } from './person-search.page';

describe('PersonSearchPage', () => {
  let component: PersonSearchPage;
  let fixture: ComponentFixture<PersonSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonSearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
