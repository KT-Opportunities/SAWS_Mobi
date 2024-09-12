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
  currentScale = 1; // Track the current scale
  lastScale = 1; // Keep track of the last scale to accumulate zoom
  hammer!: HammerManager;

  panX = 0; // Track horizontal panning
  panY = 0; // Track vertical panning
  lastPanX = 0; // Store last pan X position
  lastPanY = 0; // Store last pan Y position

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

  // Initialize pinch-to-zoom and pan functionality with Hammer.js
  setupPinchToZoom() {
    const imageContainer = this.imageContainer.nativeElement as HTMLElement;
    this.hammer = new Hammer(imageContainer);

    // Enable pinch and pan gestures
    this.hammer.get('pinch').set({ enable: true });
    this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    // Handle pinch (zoom) events
    this.hammer.on('pinchmove', (event) => {
      this.currentScale = Math.max(1, Math.min(this.lastScale * event.scale, 4)); // Limit zoom between 1x and 4x
      this.applyImageTransform();
    });

    // Store the final scale when pinch ends
    this.hammer.on('pinchend', () => {
      this.lastScale = this.currentScale; // Save the last scale for the next pinch event
    });

    // Handle pan (drag) events
    this.hammer.on('panmove', (event) => {
      if (this.currentScale > 1) { // Only allow panning if the image is zoomed in
        this.panX = this.lastPanX + event.deltaX;
        this.panY = this.lastPanY + event.deltaY;
        this.applyImageTransform();
      }
    });

    // Store pan positions when panning ends
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

  toggleZoom() {
    const image = this.imageContainer.nativeElement.querySelector('.fileImage') as HTMLElement;

    if (this.isZoomedIn) {
      this.currentScale = 1; // Reset zoom (zoom out)
      this.panX = 0;
      this.panY = 0; // Reset panning
      image.style.cursor = 'zoom-in';
    } else {
      this.currentScale = 2; // Zoom in
      image.style.cursor = 'zoom-out';
    }

    this.isZoomedIn = !this.isZoomedIn; // Toggle zoom state
    this.lastScale = this.currentScale; // Update last scale
    this.applyImageTransform(); // Apply zoom and panning
  }

  // Rotate the image by 90 degrees
  rotateImage(): void {
    this.rotationDegree = (this.rotationDegree + 90) % 360;
    this.applyImageTransform();
  }

  // Apply scale, rotation, and pan transformations to the image
  applyImageTransform(): void {
    const imageElement = this.imageContainer.nativeElement.querySelector('img');
    if (imageElement) {
      const scale = this.currentScale;
      imageElement.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${scale}) rotate(${this.rotationDegree}deg)`;
    }
  }

  // Close the dialog
  closeImageDialog() {
    this.dialogRef.close();
  }

  // Handle orientation changes (optional)
  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event: any) {
    this.updateImageRotation();
  }

  // Update image rotation based on screen orientation (optional)
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
