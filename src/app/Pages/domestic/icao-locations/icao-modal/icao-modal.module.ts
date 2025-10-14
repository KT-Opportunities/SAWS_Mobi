import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { IcaoModalComponent } from './icao-modal.component';

@NgModule({
  declarations: [IcaoModalComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [IcaoModalComponent],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IcaoModalModule {}
