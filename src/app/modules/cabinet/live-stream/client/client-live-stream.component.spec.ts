import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLiveStreamComponent } from './client-live-stream.component';

describe('ClientLiveStreamComponent', () => {
  let component: ClientLiveStreamComponent;
  let fixture: ComponentFixture<ClientLiveStreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLiveStreamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLiveStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
