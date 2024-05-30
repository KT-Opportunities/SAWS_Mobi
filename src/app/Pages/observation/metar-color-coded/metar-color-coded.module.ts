import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MetarColorCodedRoutingModule } from './metar-color-coded-routing.module';
import { MetarColorCodedComponent } from './metar-color-coded.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MetarColorCodedRoutingModule
  ],
  declarations: [MetarColorCodedComponent]
})
export class MetarColorCodedModule { }
