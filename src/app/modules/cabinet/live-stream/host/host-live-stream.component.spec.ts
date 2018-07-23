import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostLiveStreamComponent } from './host-live-stream.component';

describe('HostLiveStreamComponent', () => {
  let component: HostLiveStreamComponent;
  let fixture: ComponentFixture<HostLiveStreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostLiveStreamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostLiveStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
