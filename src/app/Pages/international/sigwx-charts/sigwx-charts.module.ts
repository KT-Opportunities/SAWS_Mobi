
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SigwxChartsRoutingModule } from './sigwx-charts-routing.module';
import { SigwxChartsComponent } from './sigwx-charts.component';
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SigwxChartsRoutingModule, SharedModule],
  declarations: [SigwxChartsComponent],
})
export class SigwxChartsModule {}