import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImageViewrPageRoutingModule } from './image-viewr-routing.module';

import { ImageViewrPage } from './image-viewr.page';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
   
    MatIconModule, // Add MatIconModule here if it's used in your ViewImagePage component
    MatDialogModule ,
    ImageViewrPageRoutingModule
  ],
  declarations: [ImageViewrPage]
})
export class ImageViewrPageModule {}
