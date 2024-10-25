import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GridMaximumPageRoutingModule } from './grid-maximum-routing.module';

import { GridMaximumPage } from './grid-maximum.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    GridMaximumPageRoutingModule
  ],
  declarations: [GridMaximumPage]
})
export class GridMaximumPageModule {}
