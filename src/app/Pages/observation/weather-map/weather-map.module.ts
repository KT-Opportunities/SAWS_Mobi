import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WeatherMapRoutingModule } from './weather-map-routing.module';
import { WeatherMapComponent } from './weather-map.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    WeatherMapRoutingModule
  ],
  declarations: [WeatherMapComponent]
})
export class WeatherMapModule { }
