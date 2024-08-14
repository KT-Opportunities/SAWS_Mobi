import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditRoutingModule } from './edit-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditComponent } from './edit.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditRoutingModule,
    SharedModule
  ],
  declarations: [EditComponent]
})
export class EditModule { }
