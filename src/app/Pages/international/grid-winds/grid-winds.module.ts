import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GridWindsPageRoutingModule } from './grid-winds-routing.module';

import { GridWindsPage } from './grid-winds.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GridWindsPageRoutingModule
  ],
  declarations: [GridWindsPage]
})
export class GridWindsPageModule {}
