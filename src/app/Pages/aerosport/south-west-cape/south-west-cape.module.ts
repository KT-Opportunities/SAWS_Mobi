import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SouthWestCapePageRoutingModule } from './south-west-cape-routing.module';

import { SouthWestCapePage } from './south-west-cape.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SouthWestCapePageRoutingModule
  ],
  declarations: [SouthWestCapePage]
})
export class SouthWestCapePageModule {}
