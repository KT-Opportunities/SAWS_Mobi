import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewColorCodedStylePageRoutingModule } from './view-color-coded-style-routing.module';

import { ViewColorCodedStylePage } from './view-color-coded-style.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewColorCodedStylePageRoutingModule
  ],
  declarations: [ViewColorCodedStylePage]
})
export class ViewColorCodedStylePageModule {}
