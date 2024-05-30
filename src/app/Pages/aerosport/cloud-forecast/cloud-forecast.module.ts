import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudForecastRoutingModule } from './cloud-forecast-routing.module';
import { CloudForecastComponent } from './cloud-forecast.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CloudForecastRoutingModule
  ],
  declarations: [CloudForecastComponent]
})
export class CloudForecastModule { }
