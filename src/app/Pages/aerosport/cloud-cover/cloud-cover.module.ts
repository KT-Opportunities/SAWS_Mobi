import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudCoverRoutingModule } from './cloud-cover-routing.module';
import { CloudCoverComponent } from './cloud-cover.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CloudCoverRoutingModule
  ],
  declarations: [CloudCoverComponent]
})
export class CloudCoverModule { }
