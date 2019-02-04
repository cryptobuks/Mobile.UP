import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrarySearchPage } from './library-search.page';

describe('LibrarySearchPage', () => {
  let component: LibrarySearchPage;
  let fixture: ComponentFixture<LibrarySearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibrarySearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibrarySearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
