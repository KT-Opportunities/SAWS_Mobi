import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CentralInterioPageRoutingModule } from './central-interio-routing.module';

import { CentralInterioPage } from './central-interio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CentralInterioPageRoutingModule
  ],
  declarations: [CentralInterioPage]
})
export class CentralInterioPageModule {}
