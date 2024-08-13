import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecentTafsRoutingModule } from './recent-tafs-routing.module';

import { RecentTafsComponent } from './recent-tafs.component';
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecentTafsRoutingModule,
    SharedModule
],
  declarations: [RecentTafsComponent],
  providers: [DatePipe]
})
export class RecentTafsModule {}
