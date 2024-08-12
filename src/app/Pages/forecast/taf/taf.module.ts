import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TafRoutingModule } from './taf-routing.module';
import { TafComponent } from './taf.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TafRoutingModule,
    SharedModule
  ],
  declarations: [TafComponent],
  providers: [DatePipe]
})
export class TafModule {}
