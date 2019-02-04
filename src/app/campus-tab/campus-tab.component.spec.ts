import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusTabComponent } from './campus-tab.component';

describe('CampusTabComponent', () => {
  let component: CampusTabComponent;
  let fixture: ComponentFixture<CampusTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampusTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampusTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
