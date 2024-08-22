import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MetarRoutingModule } from './metar-routing.module';
import { MetarComponent } from './metar.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MetarRoutingModule
  ],
  declarations: [MetarComponent]
})
export class MetarModule { }
