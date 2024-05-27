import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LandingPage } from './landing-page.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LandingPageRoutingModule
  ],
  declarations: [LandingPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LandingPageModule {}
