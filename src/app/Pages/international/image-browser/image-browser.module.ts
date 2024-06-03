import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ImageBrowserRoutingModule } from './image-browser-routing.module';
import { ImageBrowserComponent } from './image-browser.component';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    IonicModule, 
    ImageBrowserRoutingModule
  ],
  declarations: [ImageBrowserComponent],
})
export class ImageBrowserModule {}
