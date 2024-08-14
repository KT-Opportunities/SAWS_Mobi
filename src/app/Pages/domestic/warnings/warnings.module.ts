import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WarningsComponent } from './warnings.component';
import { WarningsRoutingModule } from './warnings-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    WarningsRoutingModule
  ],
  declarations: [WarningsComponent]
})
export class WarningsModule {}
