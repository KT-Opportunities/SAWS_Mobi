import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { IonicModule } from '@ionic/angular';
import { ServiceHeaderComponent } from './service-header/service-header.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  declarations: [
    FooterComponent,
    ServiceHeaderComponent
  ],
  exports: [
    FooterComponent,
    ServiceHeaderComponent
  ]
})
export class SharedModule { }
