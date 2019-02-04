import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportPage } from './transport.page';

describe('TransportPage', () => {
  let component: TransportPage;
  let fixture: ComponentFixture<TransportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
