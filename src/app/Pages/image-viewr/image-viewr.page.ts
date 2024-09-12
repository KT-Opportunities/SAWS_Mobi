import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-image-viewr',
  templateUrl: './image-viewr.page.html',
  styleUrls: ['./image-viewr.page.scss'],
})
export class ImageViewrPage implements OnInit {

  @ViewChild('imageContainer', { static: true }) imageContainer!: ElementRef; // Container for the image
  rotationDegree = 0; // For handling image rotation
  fileBaseUrl: SafeResourceUrl; // The image URL
  isZoomed = false; // For tracking zoom state
  isZoomedIn = false; // To track the zoom state

  constructor(
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<ImageViewrPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Generate the image URL using data passed to the dialog
    const imageUrl = 'data:image/jpeg/gif;base64,' + data.filetextcontent; // Update MIME type as needed
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
  }

  ngOnInit() {
    this.updateImageRotation(); // Set initial rotation on component load
  }

  // Double click to zoom in/out
  @HostListener('dblclick', ['$event'])
  onDoubleClick(event: MouseEvent): void {
    this.toggleZoom(); // Call zoom toggle on double-click
  }

  toggleZoom() {
    const imageContainer = this.imageContainer.nativeElement as HTMLElement; 
    const image = imageContainer.querySelector('.fileImage') as HTMLElement;
    
    if (this.isZoomedIn) {
      // Reset zoom (zoom out)
      image.style.transform = 'scale(1)';
      imageContainer.style.overflow = 'auto'; // Allow scrolling
      image.style.cursor = 'zoom-in';
    } else {
      // Zoom in
      image.style.transform = 'scale(2)'; // Or any zoom level you need
      imageContainer.style.overflow = 'auto'; // Allow scrolling
      image.style.cursor = 'zoom-out';
    }
  
    this.isZoomedIn = !this.isZoomedIn; // Toggle zoom state
  }
  
  // Rotate image by 90 degrees
  rotateImage(): void {
    this.rotationDegree = (this.rotationDegree + 90) % 360; // Keep rotation between 0 and 360
    this.applyImageTransform(); // Apply both rotation and zoom
  }

  // Apply the current zoom and rotation transform
  applyImageTransform(): void {
    const imageElement = this.imageContainer.nativeElement.querySelector('img');
    if (imageElement) {
      const scale = this.isZoomedIn ? 2 : 1; // Determine scale based on zoom state
      imageElement.style.transform = `scale(${scale}) rotate(${this.rotationDegree}deg)`; // Apply transform
    }
  }

  // Close the dialog
  closeImageDialog() {
    this.dialogRef.close(); // Close dialog when clicking close
  }

  // Handle orientation change events (optional if you want to support screen rotation)
  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event: any) {
    this.updateImageRotation(); // Update rotation on screen orientation change
  }

  // Update image rotation based on screen orientation (optional)
  updateImageRotation(): void {
    switch (window.orientation) {
      case 0: // Portrait
        this.rotationDegree = 0;
        break;
      case 90: // Landscape right
        this.rotationDegree = 90;
        break;
      case -90: // Landscape left
        this.rotationDegree = -90;
        break;
      case 180: // Upside-down portrait
        this.rotationDegree = 180;
        break;
      default:
        this.rotationDegree = 0;
    }
    this.applyImageTransform(); // Reapply the transform
  }
}
