import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpmRoutingModule } from './gpm-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GpmComponent } from './gpm.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GpmRoutingModule
  ],
  declarations: [GpmComponent]
})
export class GpmModule { }
