import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MetarTafRecentRoutingModule } from './metar-taf-recent-routing.module';
import { MetarTafRecentComponent } from './metar-taf-recent.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MetarTafRecentRoutingModule
  ],
  declarations: [MetarTafRecentComponent]
})
export class MetarTafRecentModule { }
