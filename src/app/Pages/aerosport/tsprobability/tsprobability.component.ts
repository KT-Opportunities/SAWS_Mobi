import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PanZoomConfig } from 'ngx-panzoom';
import { APIService } from 'src/app/services/apis.service';

@Component({
  selector: 'app-tsprobability',
  templateUrl: './tsprobability.component.html',
  styleUrls: ['./tsprobability.component.scss'],
})
export class TSProbabilityComponent implements OnInit {
  rotationDegree = 0;
  @ViewChild('imageContainer', { static: true }) imageContainer!: ElementRef;

  scale = 1;

  pinchStartScale = 1;
  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event: any) {
    this.updateImageRotation();
  }

  isZoomed = false;
  @HostListener('dblclick', ['$event'])
  onDoubleClick(event: MouseEvent): void {
    this.toggleZoom();
  }

  toggleZoom(): void {
    if (!this.imageContainer) {
      console.error('Image container is not defined');
      return;
    }
    const imageElement = this.imageContainer.nativeElement.querySelector('img');
    if (imageElement) {
      this.isZoomed = !this.isZoomed;
      imageElement.style.transform = this.isZoomed ? 'scale(5)' : 'scale(1)';
      imageElement.style.cursor = this.isZoomed ? 'zoom-out' : 'zoom-in';
    }
  }
  currentImageIndex: number = 0;
  TsProbability: any = [];
  loading: boolean = false;
  fileBaseUrlNext: SafeResourceUrl;
  fileBaseUrlPrevious: SafeResourceUrl;
  prevday: boolean = false; // Define prevday property
  nextday: boolean = true; // Define nextday property

  constructor(
    private router: Router,
    private elRef: ElementRef,
    private http: HttpClient,
    private APIService: APIService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    this.fileBaseUrlNext = this.sanitizer.bypassSecurityTrustResourceUrl('');
    this.fileBaseUrlPrevious =
      this.sanitizer.bypassSecurityTrustResourceUrl('');

   
  }
  rotateImage(): void {
    this.rotationDegree += 90;
    if (this.rotationDegree >= 360) {
      this.rotationDegree = 0;
    }
  }

  10: 29;
  fileBaseUrl: any = null; // Holds the image URL for display
  rotationAngle: number = 0; // T
  NavigateToAerosport() {
    this.router.navigate(['/aero-sport']);
  }

  ngOnInit() {
    this.loading = true;
    this.APIService.GetSourceAviationFolderFilesList('aerosport').subscribe(
      (data) => {
        try {
          this.TsProbability = data.filter(
            (item: any) =>
              item.filename === 'tsprob_d1.gif' ||
              item.filename === 'tsprob_d2.gif'
          );

          if (this.TsProbability.length > 0) {
            // Set default image URLs
            this.setDefaultImages();
            this.updateButtonVisibility();
          }

          this.loading = false;
        } catch (error) {
          console.log('Error parsing JSON data:', error);
          this.loading = false;
        }
      },
      (error) => {
        console.log('Error fetching JSON data:', error);
        this.loading = false;
      }
    );
  }

  setDefaultImages() {
    if (this.TsProbability.length > 0) {
      // Set the first image as the default previous day image
      this.loadImage(0, 'fileBaseUrlPrevious');

      // Set the second image as the default next day image if it exists
      if (this.TsProbability.length > 1) {
        this.loadImage(1, 'fileBaseUrlNext');
      }
    }
  }
  setupHammer() {
    if (this.imageContainer && this.imageContainer.nativeElement) {
      const hammer = new Hammer(this.imageContainer.nativeElement);

      // Enable pinch gesture
      hammer.get('pinch').set({ enable: true });

      // Handle pinch start
      hammer.on('pinchstart', (ev) => {
        this.pinchStartScale = this.scale;
      });

      // Handle pinch move
      hammer.on('pinchmove', (ev) => {
        this.scale = this.pinchStartScale * ev.scale;
        this.updateImageTransform();
      });
    }
  }
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
  }
  updateImageTransform() {
    const imageElement = this.imageContainer.nativeElement.querySelector('img');
    if (imageElement) {
      imageElement.style.transform = `scale(${this.scale}) rotate(${this.rotationDegree}deg)`;
      imageElement.style.cursor = this.isZoomed ? 'zoom-out' : 'zoom-in';
    }
  }
  loadImage(index: number, target: 'fileBaseUrlPrevious' | 'fileBaseUrlNext') {
    this.APIService.GetAviationFile(
      this.TsProbability[index].foldername,
      this.TsProbability[index].filename
    ).subscribe(
      (data) => {
        const imageUrl = 'data:image/gif;base64,' + data.filecontent; // Adjust the MIME type accordingly
        this[target] = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
      },
      (error) => {
        console.log('Error fetching JSON data:', error);
        this.loading = false;
      }
    );
  }

  previousDay() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.loadImage(this.currentImageIndex, 'fileBaseUrlPrevious');
      this.updateButtonVisibility();
    }
  }
  
  nextDay() {
    if (this.currentImageIndex < this.TsProbability.length - 1) {
      this.currentImageIndex++;
      this.loadImage(this.currentImageIndex, 'fileBaseUrlNext');
      this.updateButtonVisibility();
    }
  }
  

  updateButtonVisibility() {
    this.prevday = this.currentImageIndex > 0;
    this.nextday = this.currentImageIndex < this.TsProbability.length - 1;
  }
  
}
