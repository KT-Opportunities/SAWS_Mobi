import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlightBriefingPageRoutingModule } from './flight-briefing-routing.module';

import { FlightBriefingPage } from './flight-briefing.page';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlightBriefingPageRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  declarations: [FlightBriefingPage]
})
export class FlightBriefingPageModule {}
