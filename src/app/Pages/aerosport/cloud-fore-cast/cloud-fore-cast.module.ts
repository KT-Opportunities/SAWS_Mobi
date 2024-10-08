import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CloudForeCastPageRoutingModule } from './cloud-fore-cast-routing.module';
import { CloudForeCastComponent } from './cloud-fore-cast.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CloudForeCastPageRoutingModule,
  ],
  declarations: [CloudForeCastComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class CloudForeCastModule {}
