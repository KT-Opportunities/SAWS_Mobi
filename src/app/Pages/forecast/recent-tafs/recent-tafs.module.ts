import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecentTafsRoutingModule } from './recent-tafs-routing.module';

import { RecentTafsComponent } from './recent-tafs.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecentTafsRoutingModule
  ],
  declarations: [RecentTafsComponent]
})
export class RecentTafsModule {}
