import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportExportRoutingModule } from './import-export-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ImportExportComponent } from './import-export.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImportExportRoutingModule
  ],
  declarations: [ImportExportComponent]
})
export class ImportExportModule { }
