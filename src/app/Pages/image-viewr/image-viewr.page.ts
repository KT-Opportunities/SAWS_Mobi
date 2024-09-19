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
  @ViewChild('liveRegion', { static: true }) liveRegion!: ElementRef; // Element for screen reader announcements
  rotationDegree = 0;
  fileBaseUrl: SafeResourceUrl;
  isZoomedIn = false;
  currentScale = 1;
  lastScale = 1;
  hammer!: HammerManager;

  panX = 0;
  panY = 0;
  lastPanX = 0;
  lastPanY = 0;

  constructor(
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<ImageViewrPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const imageUrl = 'data:image/jpeg/gif;base64,' + data.filecontent; // Image data
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
  }

  ngOnInit() {
    this.updateImageRotation();
  }

  ngAfterViewInit() {
    this.setupPinchToZoom();
    this.setupDoubleTap();
    this.setupKeyboardAccessibility();
  }

  // Set up double-tap zoom functionality
  setupDoubleTap() {
    const imageContainer = this.imageContainer.nativeElement as HTMLElement;
    this.hammer = new Hammer(imageContainer);
    this.hammer.get('doubletap').set({ taps: 2 });

    this.hammer.on('doubletap', () => {
      this.toggleZoom();
      this.announceScreenReader('Image zoom toggled.');
    });
  }

  // Pinch-to-zoom and panning setup
  setupPinchToZoom() {
    const imageContainer = this.imageContainer.nativeElement as HTMLElement;
    this.hammer = new Hammer(imageContainer);

    this.hammer.get('pinch').set({ enable: true });
    this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    this.hammer.on('pinchmove', (event) => {
      this.currentScale = Math.max(1, Math.min(this.lastScale * event.scale, 4));
      this.applyImageTransform();
      this.announceScreenReader('Zooming in progress.');
    });

    this.hammer.on('pinchend', () => {
      this.lastScale = this.currentScale;
    });

    this.hammer.on('panmove', (event) => {
      if (this.currentScale > 1) {
        this.panX = this.lastPanX + event.deltaX;
        this.panY = this.lastPanY + event.deltaY;

        const containerWidth = this.imageContainer.nativeElement.offsetWidth;
        const containerHeight = this.imageContainer.nativeElement.offsetHeight;

        const imageElement = this.imageContainer.nativeElement.querySelector('img');
        const scaledImageWidth = imageElement.offsetWidth * this.currentScale;
        const scaledImageHeight = imageElement.offsetHeight * this.currentScale;

        const maxPanX = (scaledImageWidth - containerWidth) / 2;
        const maxPanY = (scaledImageHeight - containerHeight) / 2;

        this.panX = Math.max(-maxPanX, Math.min(maxPanX, this.panX));
        this.panY = Math.max(-maxPanY, Math.min(maxPanY, this.panY));

        this.applyImageTransform();
      }
    });

    this.hammer.on('panend', () => {
      this.lastPanX = this.panX;
      this.lastPanY = this.panY;
    });
  }

  // Toggle zoom with screen reader feedback
  toggleZoom() {
    const image = this.imageContainer.nativeElement.querySelector('.fileImage') as HTMLElement;

    if (this.isZoomedIn) {
      this.currentScale = 1;
      this.panX = 0;
      this.panY = 0;
      image.style.cursor = 'zoom-in';
      this.announceScreenReader('Zoomed out.');
    } else {
      this.currentScale = 2;
      image.style.cursor = 'zoom-out';
      this.announceScreenReader('Zoomed in.');
    }

    this.isZoomedIn = !this.isZoomedIn;
    this.lastScale = this.currentScale;
    this.applyImageTransform();
  }

  // Apply zoom, pan, and rotate transformations
  applyImageTransform() {
    const imageElement = this.imageContainer.nativeElement.querySelector('img');
    if (imageElement) {
      const scale = this.currentScale;
      imageElement.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${scale}) rotate(${this.rotationDegree}deg)`;
    }
  }

  // Rotate the image and announce it to screen readers
  rotateImage() {
    this.rotationDegree = (this.rotationDegree + 90) % 360;
    this.applyImageTransform();
    this.announceScreenReader(`Image rotated to ${this.rotationDegree} degrees.`);
  }

  // Close the dialog
  closeImageDialog() {
    this.dialogRef.close();
    this.announceScreenReader('Image dialog closed.');
  }

  // Handle keyboard navigation for accessibility
  setupKeyboardAccessibility() {
    this.imageContainer.nativeElement.setAttribute('tabindex', '0'); // Make the image container focusable

    this.imageContainer.nativeElement.addEventListener('keydown', (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          this.panY -= 10;
          this.applyImageTransform();
          break;
        case 'ArrowDown':
          this.panY += 10;
          this.applyImageTransform();
          break;
        case 'ArrowLeft':
          this.panX -= 10;
          this.applyImageTransform();
          break;
        case 'ArrowRight':
          this.panX += 10;
          this.applyImageTransform();
          break;
        case '+':
          this.currentScale = Math.min(4, this.currentScale + 0.1);
          this.applyImageTransform();
          break;
        case '-':
          this.currentScale = Math.max(1, this.currentScale - 0.1);
          this.applyImageTransform();
          break;
        case 'r':
          this.rotateImage();
          break;
        case 'Escape':
          this.closeImageDialog();
          break;
      }
    });
  }

  // Announce messages to screen readers
  announceScreenReader(message: string) {
    this.liveRegion.nativeElement.innerText = message;
  }

  // Handle window orientation changes
  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange() {
    this.updateImageRotation();
  }

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
    this.applyImageTransform();
  }
}
