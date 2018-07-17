import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CabinetRoutingModule } from './cabinet-routing.module';
import { CabinetComponent } from './cabinet.component';
import { LandingNavbarComponent } from './landing-navbar/landing-navbar.component';
import { WebrtcComponent } from './webrtc/webrtc.component';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { Broadcast2Component } from './broadcast2/broadcast2.component';
import { SocketIoService } from "../../services/socket.io";
import { LiveStreamComponent } from './live-stream/live-stream.component';

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
    LiveStreamComponent
  ],providers   : [
    SocketIoService
  ]
})
export class CabinetModule { }
