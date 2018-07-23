import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CabinetRoutingModule } from './cabinet-routing.module';
import { CabinetComponent } from './cabinet.component';
import { LandingNavbarComponent } from './landing-navbar/landing-navbar.component';
import { WebrtcComponent } from './webrtc/webrtc.component';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { Broadcast2Component } from './broadcast2/broadcast2.component';
import { SocketIoService } from "../../services/socket.io";
import { HostLiveStreamComponent } from './live-stream/host/host-live-stream.component';
import { ClientLiveStreamComponent } from './live-stream/client/client-live-stream.component';
import { LiveStreamSocketService } from "../../services/live-stream-socket.service";

@NgModule({
  imports: [
    CommonModule,
    CabinetRoutingModule
  ],
  declarations: [
    CabinetComponent,
    LandingNavbarComponent,
    WebrtcComponent,
    BroadcastComponent,
    Broadcast2Component,
    HostLiveStreamComponent,
    ClientLiveStreamComponent
  ],providers   : [
    SocketIoService,
    LiveStreamSocketService
  ]
})
export class CabinetModule { }
