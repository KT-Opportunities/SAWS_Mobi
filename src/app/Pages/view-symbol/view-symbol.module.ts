import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewSymbolPageRoutingModule } from './view-symbol-routing.module';

import { ViewSymbolPage } from './view-symbol.page';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
   
    MatIconModule, // Add MatIconModule here if it's used in your ViewImagePage component
    MatDialogModule ,
    ViewSymbolPageRoutingModule
  ],
  declarations: [ViewSymbolPage]
})
export class ViewSymbolPageModule {}
