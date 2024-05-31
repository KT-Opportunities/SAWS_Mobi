import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TafRoutingModule } from './taf-routing.module';
import { TafComponent } from './taf.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TafRoutingModule
  ],
  declarations: [TafComponent]
})
export class TafModule {}
