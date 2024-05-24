import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GridMaximumPageRoutingModule } from './grid-maximum-routing.module';

import { GridMaximumPage } from './grid-maximum.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GridMaximumPageRoutingModule
  ],
  declarations: [GridMaximumPage]
})
export class GridMaximumPageModule {}
