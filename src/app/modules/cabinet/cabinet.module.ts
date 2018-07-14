import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CabinetRoutingModule } from './cabinet-routing.module';
import { CabinetComponent } from './cabinet.component';
import { LandingNavbarComponent } from './landing-navbar/landing-navbar.component';
import { WebrtcComponent } from './webrtc/webrtc.component';
import { BroadcastComponent } from './broadcast/broadcast.component';

@NgModule({
  imports: [
    CommonModule,
    CabinetRoutingModule
  ],
  declarations: [
    CabinetComponent,
    LandingNavbarComponent,
    WebrtcComponent,
    BroadcastComponent
  ]
})
export class CabinetModule { }
