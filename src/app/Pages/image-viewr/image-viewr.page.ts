import { Component, OnInit, HostListener, ElementRef, ViewChild, Inject, AfterViewInit } from '@angular/core';
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
  @ViewChild('liveRegion', { static: true }) liveRegion!: ElementRef; // Element for screen reader announcements

  rotationDegree = 0; // Current rotation of the image in degrees
  fileBaseUrl: SafeResourceUrl; // URL for the image source
  isZoomedIn = false; // Flag to check if the image is zoomed in or not
  currentScale = 1; // Current zoom scale of the image
  lastScale = 1; // Last scale used to calculate zoom changes
  hammer!: HammerManager; // Hammer.js manager instance for gesture handling

  panX = 0; // Horizontal pan offset
  panY = 0; // Vertical pan offset
  lastPanX = 0; // Last horizontal pan offset to track changes
  lastPanY = 0; // Last vertical pan offset to track changes

  constructor(
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<ImageViewrPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Create a SafeResourceUrl for the image using Base64 data
    const imageUrl = 'data:image/jpeg;base64,' + data.filecontent; // Image data
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
  }

  ngOnInit() {
    // Initialize rotation and zoom settings based on data or default values
    this.updateImageRotation();
    this.currentScale = 1; // Ensure initial scale is set to 1 (default zoom level)
    this.isZoomedIn = false; // Ensure initial zoom state is not zoomed in
  }

  ngAfterViewInit() {
    // Set up gesture handling and accessibility after view initialization
    this.setupPinchToZoom();
    this.setupDoubleTap();
    this.setupKeyboardAccessibility();
    this.applyImageTransform(); // Apply initial transform settings
  }

  // Functionality for double-tapping to toggle zoom (in/out)
  setupDoubleTap() {
    const imageContainer = this.imageContainer.nativeElement as HTMLElement;
    this.hammer = new Hammer(imageContainer);
    this.hammer.get('doubletap').set({ taps: 2 });

    // Toggle zoom on double-tap and announce it for screen readers
    this.hammer.on('doubletap', () => {
      this.toggleZoom();
      this.announceScreenReader('Image zoom toggled.');
    });
  }

  // Functionality for pinch-to-zoom and panning using touch gestures
  setupPinchToZoom() {
    const imageContainer = this.imageContainer.nativeElement as HTMLElement;
    this.hammer = new Hammer(imageContainer);

    // Enable pinch and pan gestures
    this.hammer.get('pinch').set({ enable: true });
    this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    // Handle pinch-to-zoom
    this.hammer.on('pinchmove', (event) => {
      this.currentScale = Math.max(1, Math.min(this.lastScale * event.scale, 4)); // Limit zoom range between 1x and 4x
      this.applyImageTransform();
      this.announceScreenReader('Zooming in progress.');
    });

    this.hammer.on('pinchend', () => {
      this.lastScale = this.currentScale; // Update last scale after pinch ends
    });

    // Handle panning
    this.hammer.on('panmove', (event) => {
      if (this.currentScale > 1) {
        this.panX = this.lastPanX + event.deltaX;
        this.panY = this.lastPanY + event.deltaY;
        this.applyImageTransform();
      }
    });

    this.hammer.on('panend', () => {
      this.lastScale = this.currentScale; // Update last scale after pinch ends
    });
  }

  // Function to toggle zoom in or out when double-tapped
  toggleZoom() {
    const image = this.imageContainer.nativeElement.querySelector('img') as HTMLElement;

    if (this.isZoomedIn) {
      // Zoom out to the original scale
      this.currentScale = 1;
      this.panX = 0;
      this.panY = 0;
      image.style.cursor = 'zoom-in';
      this.announceScreenReader('Zoomed out.');
    } else {
      // Zoom in to a scale of 2x
      this.currentScale = 2;
      image.style.cursor = 'zoom-out';
      this.announceScreenReader('Zoomed in.');
    }

    this.isZoomedIn = !this.isZoomedIn;
    this.lastScale = this.currentScale;
    this.applyImageTransform();
  }

  // Apply the CSS transforms for zooming, panning, and rotating the image
 // Apply the CSS transforms for zooming, panning, and rotating the image
applyImageTransform() {
  const imageElement = this.imageContainer.nativeElement.querySelector('img');
  if (imageElement) {
    // Set transform origin to the center of the image
    imageElement.style.transformOrigin = '0 0';

    // Apply the pan, zoom, and rotation transforms
    imageElement.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.currentScale}) rotate(${this.rotationDegree}deg)`;
    imageElement.style.transition = 'transform 0.2s ease-in-out'; // Smooth transition for transformations

    // After applying transform, call function to prevent image from going out of bounds
    this.preventImageOverflow(imageElement);
  }
}
preventImageOverflow(imageElement: HTMLElement) {
  const img = imageElement as HTMLImageElement; // Cast to HTMLImageElement
  const containerWidth = this.imageContainer.nativeElement.clientWidth;
  const containerHeight = this.imageContainer.nativeElement.clientHeight;
  
  const imageWidth = img.naturalWidth * this.currentScale;
  const imageHeight = img.naturalHeight * this.currentScale;
  
  // Calculate the limits for panning based on image size and container size
  const maxPanX = (imageWidth - containerWidth) / 2;
  const maxPanY = (imageHeight - containerHeight) / 2;

  // Adjust panX and panY to prevent the image from going out of bounds
  this.panX = Math.max(-maxPanX, Math.min(this.panX, maxPanX));
  this.panY = Math.max(-maxPanY, Math.min(this.panY, maxPanY));

  // Reapply the updated pan values
  img.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.currentScale}) rotate(${this.rotationDegree}deg)`;
}




  // Rotate the image by 90 degrees each time the function is called
  rotateImage() {
    this.rotationDegree = (this.rotationDegree + 90) % 360; // Rotate image by 90 degrees
    this.applyImageTransform();
    this.announceScreenReader(`Image rotated to ${this.rotationDegree} degrees.`);
  }

  // Close the dialog when the user clicks the close button or presses Escape
  closeImageDialog() {
    this.dialogRef.close(); // Close the dialog
    this.announceScreenReader('Image dialog closed.');
  }

  // Set up keyboard navigation and accessibility for screen readers
  setupKeyboardAccessibility() {
    this.imageContainer.nativeElement.setAttribute('tabindex', '0'); // Make container focusable

    // Add keyboard event listener for accessibility
    this.imageContainer.nativeElement.addEventListener('keydown', (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          this.panY -= 10; // Move up
          this.applyImageTransform();
          break;
        case 'ArrowDown':
          this.panY += 10; // Move down
          this.applyImageTransform();
          break;
        case 'ArrowLeft':
          this.panX -= 10; // Move left
          this.applyImageTransform();
          break;
        case 'ArrowRight':
          this.panX += 10; // Move right
          this.applyImageTransform();
          break;
        case '+':
          this.currentScale = Math.min(4, this.currentScale + 0.1); // Zoom in
          this.applyImageTransform();
          break;
        case '-':
          this.currentScale = Math.max(1, this.currentScale - 0.1); // Zoom out
          this.applyImageTransform();
          break;
        case 'r':
          this.rotateImage(); // Rotate image
          break;
        case 'Escape':
          this.closeImageDialog(); // Close dialog
          break;
      }
    });
  }

  // Function to announce events for screen reader accessibility
  announceScreenReader(message: string) {
    this.liveRegion.nativeElement.innerText = message; // Announce messages for screen readers
  }

  // Handle screen orientation changes and rotate the image accordingly
  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange() {
    this.updateImageRotation(); // Update image rotation on orientation change
  }

  // Update the image rotation based on the screen orientation
  updateImageRotation() {
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
    this.applyImageTransform(); // Apply the rotation to the image
  }
}
