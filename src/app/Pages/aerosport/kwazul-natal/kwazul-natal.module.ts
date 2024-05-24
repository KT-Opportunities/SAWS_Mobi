import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KwazulNatalPageRoutingModule } from './kwazul-natal-routing.module';

import { KwazulNatalPage } from './kwazul-natal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KwazulNatalPageRoutingModule
  ],
  declarations: [KwazulNatalPage]
})
export class KwazulNatalPageModule {}
