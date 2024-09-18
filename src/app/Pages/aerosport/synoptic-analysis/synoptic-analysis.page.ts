import {
  Component,
  OnInit,
  ElementRef,
  ChangeDetectorRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { APIService } from 'src/app/services/apis.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { HammerGestureConfig } from '@angular/platform-browser';

@Component({
  selector: 'app-synoptic-analysis',
  templateUrl: './synoptic-analysis.page.html',
  styleUrls: ['./synoptic-analysis.page.scss'],
})
export class SynopticAnalysisPage implements OnInit {
  fileBaseUrlSynoptic: SafeResourceUrl = '';
  rotationDegree = 0;
  scale = 1;
  maxScale = 5; // Set max scale
  minScale = 1; // Set min scale
  loading: boolean = true;

  pinchStartScale = 1;
  @ViewChild('imageContainer', { static: false }) imageContainer!: ElementRef;

  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private APIService: APIService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.loadSynopticData();
    }
  }

  loadSynopticData() {
    this.loading = true;
    this.APIService.GetSourceAviationFolderFilesListNull().subscribe(
      (data) => {
        const filteredData = data.filter(
          (item: any) => item.filename === 'synoptic.png'
        );
        if (filteredData.length > 0) {
          this.loadImage(filteredData[0].filename);
        } else {
          this.loading = false;
        }
      },
      (error) => {
        console.error('Error fetching JSON data:', error);
        this.loading = false;
      }
    );
  }

  loadImage(filename: string) {
    this.APIService.GetAviationFile('', filename).subscribe(
      (data) => {
        const imageUrlSynoptic =
          'data:image/png;base64,' + data.filecontent;
        this.fileBaseUrlSynoptic =
          this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlSynoptic);
        this.loading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching image data:', error);
        this.loading = false;
      }
    );
  }

  rotateImage(): void {
    this.rotationDegree += 90;
    if (this.rotationDegree >= 360) {
      this.rotationDegree = 0;
    }
  }

  onPinch(event: any) {
    const newScale = this.scale * event.scale;
    if (newScale >= this.minScale && newScale <= this.maxScale) {
      this.scale = newScale;
      this.applyZoom();
    }
  }

  applyZoom() {
    const imageElement = document.querySelector('.zoomed-image') as HTMLElement;
    if (imageElement) {
      imageElement.style.transform = `scale(${this.scale})`;
    }
  }
  setupHammer() {
    if (this.imageContainer && this.imageContainer.nativeElement) {
      const hammer = new Hammer(this.imageContainer.nativeElement);
      const imageElement =
        this.imageContainer.nativeElement.querySelector('img');

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

        // Adjust margins based on the zoom level
        if (imageElement) {
          const zoomFactor = this.scale;
          const containerWidth = this.imageContainer.nativeElement.clientWidth;
          const containerHeight =
            this.imageContainer.nativeElement.clientHeight;
          const imageWidth = imageElement.offsetWidth * zoomFactor;
          const imageHeight = imageElement.offsetHeight * zoomFactor;

          // Calculate margins to prevent content from being cut off
          const marginLeft = Math.max(0, (imageWidth - containerWidth) / 2);
          const marginTop = Math.max(0, (imageHeight - containerHeight) / 2);

          imageElement.style.marginLeft = `${marginLeft}px`;
          imageElement.style.marginTop = `${marginTop}px`;
        }
      });

      // Handle pan gestures for scrolling
      hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
      hammer.on('panmove', (ev) => {
        this.imageContainer.nativeElement.scrollLeft -= ev.deltaX;
        this.imageContainer.nativeElement.scrollTop -= ev.deltaY;
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
  isZoomed = false;
  updateImageTransform() {
    const imageElement = this.imageContainer.nativeElement.querySelector('img');
    if (imageElement) {
      imageElement.style.transform = `scale(${this.scale}) rotate(${this.rotationDegree}deg)`;
      imageElement.style.cursor = this.isZoomed ? 'zoom-out' : 'zoom-in';
    }
  }
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

      if (this.isZoomed) {
        imageElement.style.transform = 'scale(3)'; // Adjust zoom level
        imageElement.style.cursor = 'zoom-out';
        this.imageContainer.nativeElement.style.overflow = 'auto'; // Enable scrolling

        // Add margins when zoomed in
        imageElement.style.marginTop = '946px';
        imageElement.style.marginLeft = '391px';
      } else {
        imageElement.style.transform = 'scale(1)';
        imageElement.style.cursor = 'zoom-in';
        this.imageContainer.nativeElement.style.overflow = 'hidden'; // Disable scrolling

        // Remove margins when not zoomed
        imageElement.style.marginTop = '0';
        imageElement.style.marginLeft = '0';
      }
    }
  }
  NavigateToAerosport() {
    this.router.navigate(['/aero-sport']);
  }
}
