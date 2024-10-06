import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CloudForeCastPageRoutingModule } from './cloud-fore-cast-routing.module';
import { CloudForeCastComponent } from './cloud-fore-cast.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CloudForeCastPageRoutingModule,
    PinchZoomModule,
  ],
  declarations: [CloudForeCastComponent]
})
export class CloudForeCastModule {}
