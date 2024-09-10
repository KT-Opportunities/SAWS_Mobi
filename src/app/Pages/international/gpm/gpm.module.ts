import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpmRoutingModule } from './gpm-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GpmComponent } from './gpm.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GpmRoutingModule,
    SharedModule
  ],
  declarations: [GpmComponent]
})
export class GpmModule { }
