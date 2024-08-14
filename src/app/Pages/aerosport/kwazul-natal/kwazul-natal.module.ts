import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KwazulNatalPageRoutingModule } from './kwazul-natal-routing.module';

import { KwazulNatalPage } from './kwazul-natal.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    KwazulNatalPageRoutingModule
  ],
  declarations: [KwazulNatalPage]
})
export class KwazulNatalPageModule {}
