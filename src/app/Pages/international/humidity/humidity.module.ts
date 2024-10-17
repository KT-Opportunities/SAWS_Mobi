import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HumidityComponent } from './humidity.component';
import { HumidityRoutingModule } from './humidity-routing.module';
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HumidityRoutingModule, SharedModule],
  declarations: [HumidityComponent],
})
export class HumidityModule {}
