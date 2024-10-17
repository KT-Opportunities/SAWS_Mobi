import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MetarRecentRoutingModule } from './metar-recent-routing.module';
import { MetarRecentComponent } from './metar-recent.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MetarRecentRoutingModule
  ],
  declarations: [MetarRecentComponent]
})
export class MetarRecentModule { }
