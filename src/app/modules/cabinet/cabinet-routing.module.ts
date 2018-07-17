import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CabinetComponent } from './cabinet.component';
import { WebrtcComponent } from './webrtc/webrtc.component';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { Broadcast2Component } from "./broadcast2/broadcast2.component";

const routes: Routes = [{
  path: 'cabinet',
  component: CabinetComponent,
  children: [{
    path: 'webrtc',
    component: WebrtcComponent
  }, {
    path: 'broadcast',
    component: BroadcastComponent
  }, {
    path: 'broadcast2',
    component: Broadcast2Component
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CabinetRoutingModule { }
