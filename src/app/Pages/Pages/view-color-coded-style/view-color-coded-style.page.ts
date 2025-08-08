import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-color-coded-style',
  templateUrl: './view-color-coded-style.page.html',
  styleUrls: ['./view-color-coded-style.page.scss'],
})
export class ViewColorCodedStylePage implements OnInit {

  constructor(private dialogRef: MatDialogRef<ViewColorCodedStylePage>) { }

  ngOnInit() {
  }
showLegend = true;

openLegendPopup() {
  this.showLegend = true;
}

closeLegend() {
  this.showLegend = true;
}
 closeImageDialog() {
    this.dialogRef.close('close');
  }
}
