import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { advisoriesRoutingModule } from './advisories-routing.module';

import { AdvisoriesComponent } from './advisories.component';
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    advisoriesRoutingModule,
    SharedModule
],
  declarations: [AdvisoriesComponent]
})
export class advisoriesPageModule {}
