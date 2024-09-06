import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PanZoomConfig } from 'ngx-panzoom';

@Component({
  selector: 'app-image-viewr',
  templateUrl: './image-viewr.page.html',
  styleUrls: ['./image-viewr.page.scss'],
})
export class ImageViewrPage implements OnInit {

  rotationDegree = 0;
  panZoomConfig: PanZoomConfig ;
  fileBaseUrl: SafeResourceUrl;
  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event: any) {
    this.updateImageRotation();
  }
 

  
  

  constructor(

    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<ImageViewrPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )
  
  {

    this.panZoomConfig = new PanZoomConfig({
      zoomLevels: 5,
      scalePerZoomLevel: 1.5,
      initialZoomLevel: 1, // Starts unzoomed
      initialPanX: 0,
      initialPanY: 0,
      keepInBounds: true,
      freeMouseWheel: false,
    });
    const imageUrl = 'data:image/jpeg/gif;base64,' + data.filetextcontent; // Adjust the MIME type accordingly
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);

    // console.log('back to image:', this.fileBaseUrl);
  }
   // Method to handle image rotation based on orientation change
  //  @HostListener('window:orientationchange', ['$event'])
  //  onOrientationChange(event: any) {
  //    this.updateImageRotation();
  //  }

  ngOnInit() {
    this.updateImageRotation();
  }


  rotateImage(): void {
    this.rotationDegree += 90;
    if (this.rotationDegree >= 360) {
      this.rotationDegree = 0;
    }
    // Apply rotation to the image
    const imgElement = document.querySelector('.fileImage') as HTMLImageElement;
    if (imgElement) {
      imgElement.style.transform = `rotate(${this.rotationDegree}deg)`;
    }
  }

  // fileBaseUrl: any = null; 
  rotationAngle: number = 0; 
  updateImageRotation() {
    switch (window.orientation) {
      case 0: // Portrait
        this.rotationDegree = 0;
        break;
      case 90: // Landscape Right
        this.rotationDegree = 90;
        break;
      case -90: // Landscape Left
        this.rotationDegree = -90;
        break;
      case 180: // Upside-down Portrait
        this.rotationDegree = 180;
        break;
      default:
        this.rotationDegree = 0;
    }
    // Apply rotation on orientation change
    const imgElement = document.querySelector('.fileImage') as HTMLImageElement;
    if (imgElement) {
      imgElement.style.transform = `rotate(${this.rotationDegree}deg)`;
    }
  }


  closeImageDialog() {
    this.dialogRef.close('close');
  }
}
