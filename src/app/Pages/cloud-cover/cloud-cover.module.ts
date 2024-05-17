import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudCoverRoutingModule } from './cloud-cover-routing.module';
import { CloudCoverComponent } from './cloud-cover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CloudCoverRoutingModule
  ],
  declarations: [CloudCoverComponent]
})
export class CloudCoverModule { }
