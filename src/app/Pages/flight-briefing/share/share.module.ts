import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareRoutingModule } from './share-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShareComponent } from './share.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShareRoutingModule
  ],
  declarations: [ShareComponent]
})
export class ShareModule { }
