import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensaPage } from './mensa.page';

describe('MensaPage', () => {
  let component: MensaPage;
  let fixture: ComponentFixture<MensaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
