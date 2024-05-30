import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CentralInteriorRoutingModule} from './central-interior-routing.module';


import { CentralInteriorComponent } from './central-interior.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CentralInteriorRoutingModule
  ],
  declarations: [CentralInteriorComponent]
})
export class CentralInteriorModule {}
