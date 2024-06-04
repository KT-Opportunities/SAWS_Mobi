import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditRoutingModule } from './edit-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditComponent } from './edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditRoutingModule
  ],
  declarations: [EditComponent]
})
export class EditModule { }
