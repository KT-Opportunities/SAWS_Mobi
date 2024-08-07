import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TakeOffDatRoutingModule } from './take-off-data-routing.module';
import { TakeOffDataComponent } from './take-off-data.component';
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TakeOffDatRoutingModule,
    SharedModule
],
  declarations: [TakeOffDataComponent]
})
export class TakeOffDatModule {}
