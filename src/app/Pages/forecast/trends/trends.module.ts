import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrendsRoutingModule } from './trends-routing.module';
import { TrendsComponent } from './trends.component';
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrendsRoutingModule,
    SharedModule
],
  declarations: [TrendsComponent]
})
export class TrendsModule {}
