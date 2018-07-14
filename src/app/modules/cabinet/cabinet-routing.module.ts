import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CabinetComponent } from './cabinet.component';
import { WebrtcComponent } from './webrtc/webrtc.component';
import { BroadcastComponent } from './broadcast/broadcast.component';

const routes: Routes = [{
  path: 'cabinet',
  component: CabinetComponent,
  children: [{
    path: 'webrtc',
    component: WebrtcComponent
  }, {
    path: 'broadcast',
    component: BroadcastComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CabinetRoutingModule { }
