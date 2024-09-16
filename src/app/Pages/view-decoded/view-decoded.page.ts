import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-view-decoded',
  templateUrl: './view-decoded.page.html',
  styleUrls: ['./view-decoded.page.scss'],
})
export class ViewDecodedPage implements OnInit {
  fileBaseUrl: SafeResourceUrl;
  constructor(
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<ViewDecodedPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const imageUrl = 'data:image/jpeg/gif;base64,' + data.filecontent; // Adjust the MIME type accordingly
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);

    // console.log('back to image:', this.fileBaseUrl);
  }

  ngOnInit() {}

  closeImageDialog() {
    this.dialogRef.close('close');
  }

}
