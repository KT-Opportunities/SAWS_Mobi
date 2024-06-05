import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlightDocumentRoutingModule } from './flight-document-routing.module';
import { FlightDocumentComponent } from './flight-document.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlightDocumentRoutingModule
  ],
  declarations: [FlightDocumentComponent]
})
export class FlightDocumentModule {}
