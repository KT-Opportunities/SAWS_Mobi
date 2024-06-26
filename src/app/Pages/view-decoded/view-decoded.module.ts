import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewDecodedPageRoutingModule } from './view-decoded-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ViewDecodedPage } from './view-decoded.page';

@NgModule({
  imports: [
    MatDialogModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ViewDecodedPageRoutingModule,
  ],
  declarations: [ViewDecodedPage],
})
export class ViewDecodedPageModule {}
