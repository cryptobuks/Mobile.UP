import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensaMealComponent } from './mensa-meal.component';

describe('MensaMealComponent', () => {
  let component: MensaMealComponent;
  let fixture: ComponentFixture<MensaMealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensaMealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensaMealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
