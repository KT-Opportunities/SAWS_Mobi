import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleFlightReportRoutingModule } from './schedule-flight-report-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ScheduleFlightReportComponent } from './schedule-flight-report.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleFlightReportRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  declarations: [ScheduleFlightReportComponent]
})
export class ScheduleFlightReportModule { }
