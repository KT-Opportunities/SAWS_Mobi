import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WindsChartsRoutingModule } from './winds-charts-routing.module';
import { WindsChartsComponent } from './winds-charts.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    WindsChartsRoutingModule
  ],
  declarations: [WindsChartsComponent]
})
export class WindsChartsModule {}
