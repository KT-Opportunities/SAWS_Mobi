import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MetarHistoryRoutingModule } from './metar-history-routing.module';
import { MetarHistoryComponent } from './metar-history.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MetarHistoryRoutingModule
  ],
  declarations: [MetarHistoryComponent]
})
export class MetarHistoryModule { }
