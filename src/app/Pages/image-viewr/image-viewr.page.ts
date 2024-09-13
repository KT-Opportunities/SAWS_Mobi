import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild,
  Inject,
  AfterViewInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

@Component({
  selector: 'app-image-viewr',
  templateUrl: './image-viewr.page.html',
  styleUrls: ['./image-viewr.page.scss'],
})
export class ImageViewrPage implements OnInit, AfterViewInit {
  @ViewChild('imageContainer', { static: true }) imageContainer!: ElementRef;
  rotationDegree = 0;
  fileBaseUrl: SafeResourceUrl;
  isZoomedIn = false;
  currentScale = 1; // Track the current scale for zoom
  lastScale = 1; // Store the last scale to handle multiple zoom actions
  hammer!: HammerManager;

  panX = 0; // Horizontal panning position
  panY = 0; // Vertical panning position
  lastPanX = 0; // Store the last panX position when panning ends
  lastPanY = 0; // Store the last panY position when panning ends

  constructor(
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<ImageViewrPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const imageUrl = 'data:image/jpeg/gif;base64,' + data.filetextcontent;
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
  }

  ngOnInit() {
    this.updateImageRotation();
  }

  ngAfterViewInit() {
    this.setupPinchToZoom();
  }

  // Set up Hammer.js to handle pinch-to-zoom and panning
  setupPinchToZoom() {
    const imageContainer = this.imageContainer.nativeElement as HTMLElement;
    this.hammer = new Hammer(imageContainer);

    // Enable pinch and pan gestures
    this.hammer.get('pinch').set({ enable: true });
    this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    // Handle pinchmove event for zooming
    this.hammer.on('pinchmove', (event) => {
      this.currentScale = Math.max(1, Math.min(this.lastScale * event.scale, 4)); // Restrict zoom between 1x and 4x
      this.applyImageTransform();
    });

    // Update last scale when pinch ends
    this.hammer.on('pinchend', () => {
      this.lastScale = this.currentScale;
    });

    // Handle panning (dragging) the image
    this.hammer.on('panmove', (event) => {
      if (this.currentScale > 1) {
        this.panX = this.lastPanX + event.deltaX;
        this.panY = this.lastPanY + event.deltaY;

        // Adjust the pan boundaries to allow full scrolling when zoomed in
        const containerWidth = this.imageContainer.nativeElement.offsetWidth;
        const containerHeight = this.imageContainer.nativeElement.offsetHeight;

        const imageElement = this.imageContainer.nativeElement.querySelector('img');
        const scaledImageWidth = imageElement.offsetWidth * this.currentScale;
        const scaledImageHeight = imageElement.offsetHeight * this.currentScale;

        const maxPanX = (scaledImageWidth - containerWidth) / 2;
        const maxPanY = (scaledImageHeight - containerHeight) / 2;

        // Ensure panning stays within bounds (allow panning to all sides)
        this.panX = Math.max(-maxPanX, Math.min(maxPanX, this.panX));
        this.panY = Math.max(-maxPanY, Math.min(maxPanY, this.panY));

        this.applyImageTransform();
      }
    });

    // Store the final pan positions after pan ends
    this.hammer.on('panend', () => {
      this.lastPanX = this.panX;
      this.lastPanY = this.panY;
    });
  }

  // Toggle zoom on double-click
  @HostListener('dblclick', ['$event'])
  onDoubleClick(event: MouseEvent): void {
    this.toggleZoom();
  }

  // Toggle zoom functionality
  toggleZoom() {
    const image = this.imageContainer.nativeElement.querySelector('.fileImage') as HTMLElement;

    if (this.isZoomedIn) {
      this.currentScale = 1; // Reset zoom
      this.panX = 0;
      this.panY = 0; // Reset panning
      image.style.cursor = 'zoom-in';
    } else {
      this.currentScale = 2; // Zoom in to 2x
      image.style.cursor = 'zoom-out';
    }

    this.isZoomedIn = !this.isZoomedIn; // Toggle zoom state
    this.lastScale = this.currentScale; // Update the last scale
    this.applyImageTransform(); // Apply the transformation
  }

  // Rotate image by 90 degrees on each call
  rotateImage(): void {
    this.rotationDegree = (this.rotationDegree + 90) % 360;
    this.applyImageTransform();
  }

  // Apply the transformation to scale, rotate, and pan the image
  applyImageTransform(): void {
    const imageElement = this.imageContainer.nativeElement.querySelector('img');
    if (imageElement) {
      const scale = this.currentScale;
      imageElement.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${scale}) rotate(${this.rotationDegree}deg)`;
    }
  }

  // Close the dialog when needed
  closeImageDialog() {
    this.dialogRef.close();
  }

  // Handle orientation change and adjust rotation accordingly
  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event: any) {
    this.updateImageRotation();
  }

  // Update the image rotation based on device orientation
  updateImageRotation(): void {
    switch (window.orientation) {
      case 0:
        this.rotationDegree = 0;
        break;
      case 90:
        this.rotationDegree = 90;
        break;
      case -90:
        this.rotationDegree = -90;
        break;
      case 180:
        this.rotationDegree = 180;
        break;
      default:
        this.rotationDegree = 0;
    }
    this.applyImageTransform();
  }
}
