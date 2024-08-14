import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlightDocumentRoutingModule } from './flight-document-routing.module';
import { FlightDocumentComponent } from './flight-document.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    FlightDocumentRoutingModule


 
  ],
  declarations: [FlightDocumentComponent]
})
export class FlightDocumentModule {}
