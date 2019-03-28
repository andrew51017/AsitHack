import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleModalPage } from './sample-modal.page';

describe('SampleModalPage', () => {
  let component: SampleModalPage;
  let fixture: ComponentFixture<SampleModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
