import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-view-symbol',
  templateUrl: './view-symbol.page.html',
  styleUrls: ['./view-symbol.page.scss'],
})
export class ViewSymbolPage implements OnInit {
  imageUrl: string;
  constructor(
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<ViewSymbolPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.imageUrl = '../../assets/sxwg.gif';
    console.log('back to image:', this.imageUrl);
  }

  ngOnInit() {}

  closeImageDialog() {
    this.dialogRef.close('close');
  }
}
