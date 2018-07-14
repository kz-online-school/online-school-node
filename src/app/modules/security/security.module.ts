import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { SecurityComponent } from './security.component';
import { SecurityRoutingModule } from './security-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SecurityRoutingModule
  ],
  declarations: [
    SecurityComponent,
    LoginComponent,
    RegisterComponent
  ]
})
export class SecurityModule {
}
