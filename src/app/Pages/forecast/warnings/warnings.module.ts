import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WarningsRoutingModule } from './warnings-routing.module';

import { WarningsComponent } from './warnings.component';
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WarningsRoutingModule,
    SharedModule
],
  declarations: [WarningsComponent]
})
export class WarningsModule {}
