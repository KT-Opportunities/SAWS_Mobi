import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ImportDepartureListComponent } from './import-departure-list.component';
import { ImportDepartureListRoutingModule } from './import-departure-list-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImportDepartureListRoutingModule
  ],
  declarations: [ImportDepartureListComponent]
})
export class ImportDepartureListModule { }
