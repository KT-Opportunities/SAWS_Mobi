import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { IonicModule } from '@ionic/angular';
import { ServiceHeaderComponent } from './service-header/service-header.component';
import { ServiceContentComponent } from './service-content/service-content.component';
import { PackageHeaderComponent } from './package-header/package-header.component';
import { PackageContentComponent } from './package-content/package-content.component';
import { ServiceListItemsComponent } from './service-list-items/service-list-items.component';
import { ServiceListItemsGridComponent } from './service-list-items-grid/service-list-items-grid.component';
import { ServiceListItemComponent } from './service-list-item/service-list-item.component';
import { LoadingComponent } from './loading/loading.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PackageSubHeaderComponent } from './package-sub-header/package-sub-header.component';
import { PackageListItemsComponent } from './package-list-items/package-list-items.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    RouterModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  declarations: [
    FooterComponent,
    ServiceHeaderComponent,
    ServiceContentComponent,
    ServiceListItemsComponent,
    ServiceListItemComponent,
    ServiceListItemsGridComponent,
    PackageHeaderComponent,
    PackageSubHeaderComponent,
    PackageContentComponent,
    PackageListItemsComponent,
    LoadingComponent
  ],
  exports: [
    FooterComponent,
    ServiceHeaderComponent,
    ServiceContentComponent,
    ServiceListItemsComponent,
    ServiceListItemComponent,
    ServiceListItemsGridComponent,
    PackageHeaderComponent,
    PackageSubHeaderComponent,
    PackageContentComponent,
    PackageListItemsComponent,
    LoadingComponent
  ]
})
export class SharedModule { }
