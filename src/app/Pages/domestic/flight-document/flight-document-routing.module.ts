import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightDocumentComponent } from './flight-document.component';



const routes: Routes = [
  {
    path: '',
    component: FlightDocumentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlightDocumentRoutingModule {}
