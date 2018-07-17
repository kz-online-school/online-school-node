import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Broadcast2Component } from './broadcast2.component';

describe('Broadcast2Component', () => {
  let component: Broadcast2Component;
  let fixture: ComponentFixture<Broadcast2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Broadcast2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Broadcast2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
