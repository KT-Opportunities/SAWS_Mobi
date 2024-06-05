import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TakeOffDataComponent } from './take-off-data.component';
import { TakeOffDataRoutingModule } from './take-off-data-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TakeOffDataRoutingModule,
  ],
  declarations: [TakeOffDataComponent],
})
export class TakeOffDataModule {}
