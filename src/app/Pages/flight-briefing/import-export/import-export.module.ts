import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportExportRoutingModule } from './import-export-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ImportExportComponent } from './import-export.component';
import { SharedModule } from "../../../shared/shared.module";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImportExportRoutingModule,
    SharedModule
  ],
  declarations: [ImportExportComponent]
})
export class ImportExportModule { }
