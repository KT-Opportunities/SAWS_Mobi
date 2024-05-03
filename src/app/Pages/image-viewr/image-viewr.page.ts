import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-image-viewr',
  templateUrl: './image-viewr.page.html',
  styleUrls: ['./image-viewr.page.scss'],
})
export class ImageViewrPage implements OnInit {
  fileBaseUrl: SafeResourceUrl;
  constructor(
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<ImageViewrPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const imageUrl = 'data:image/jpeg/gif;base64,' + data.filetextcontent; // Adjust the MIME type accordingly
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);

    console.log('back to image:', this.fileBaseUrl);
  }

  ngOnInit() {}

  closeImageDialog() {
    this.dialogRef.close('close');
  }
}
