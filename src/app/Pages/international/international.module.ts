import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InternationalPageRoutingModule } from './international-routing.module';

import { InternationalPage } from './international.page';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    IonicModule,
    InternationalPageRoutingModule,
    SharedModule
  ],
  declarations: [InternationalPage]
})
export class InternationalPageModule {}
