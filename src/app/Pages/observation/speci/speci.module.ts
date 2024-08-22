import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SpeciRoutingModule } from './speci-routing.module';
import { SpeciComponent } from './speci.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SpeciRoutingModule
  ],
  declarations: [SpeciComponent]
})
export class SpeciModule { }
