import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubscriptionPackagePageRoutingModule } from './subscription-package-routing.module';

import { SubscriptionPackagePage } from './subscription-package.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubscriptionPackagePageRoutingModule
  ],
  declarations: [SubscriptionPackagePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SubscriptionPackagePageModule {}
