import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MetarRecentRoutingModule } from './metar-recent-routing.module';
import { MetarRecentComponent } from './metar-recent.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MetarRecentRoutingModule
  ],
  declarations: [MetarRecentComponent]
})
export class MetarRecentModule { }
