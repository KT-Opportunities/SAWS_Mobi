import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
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
    const imageElement = this.imageContainer.nativeElement.querySelector('img');
    const container = this.imageContainer.nativeElement;

    if (imageElement) {
      this.isZoomed = !this.isZoomed;

      if (this.isZoomed) {
        this.scale = 2; // Zoom in by 2x
        imageElement.style.cursor = 'zoom-out';
        imageElement.style.transformOrigin = 'center center';
        container.style.overflow = 'auto'; // Enable scrolling

        // Apply margins and padding during zoom
        imageElement.style.marginLeft = '215px';
        imageElement.style.marginTop = '697px';
        imageElement.style.marginRight = '217px';
        imageElement.style.marginBottom = '120px';
        imageElement.style.padding = '0px';

        // Reflow layout and adjust scroll position to center
        setTimeout(() => {
          const scrollLeft =
            (container.scrollWidth - container.clientWidth) / 2;
          const scrollTop =
            (container.scrollHeight - container.clientHeight) / 2;
          container.scrollTo(scrollLeft, scrollTop); // Center scroll to middle
        }, 0);
      } else {
        // Reset zoom to default (centered)
        this.scale = 1;
        imageElement.style.cursor = 'zoom-in';

        // Reset margins and padding to default (no additional margins)
        imageElement.style.marginLeft = '0px';
        imageElement.style.marginTop = '0px';
        imageElement.style.marginRight = '0px';
        imageElement.style.marginBottom = '0px';
        imageElement.style.padding = '0px';

        // Reset scroll to the top-left (default view)
        setTimeout(() => {
          container.scrollTo(0, 0); // Scroll back to default position
        }, 0);

        container.style.overflow = 'hidden'; // Disable scrolling
      }

      this.updateImageTransform();
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
    const defaultScale = 1; // Default scale for the image
    const minScrollScale = 1.2; // Minimum scale where scrolling is enabled
    const maxScale = 4; // Maximum scale allowed for zooming

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
        // Calculate new scale based on pinch, limiting the zoom level
        this.scale = Math.min(
          Math.max(this.pinchStartScale * ev.scale, defaultScale),
          maxScale
        );

        // Immediately enable scrolling if the image is larger than the container
        if (this.scale > minScrollScale) {
          this.imageContainer.nativeElement.style.overflow = 'auto'; // Enable scrolling
        }

        // Update image transformation (like scale)
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
        // Enable scrolling when the image is zoomed beyond a threshold scale
        if (this.scale > minScrollScale) {
          // Calculate the maximum scrollable area
          const maxScrollLeft =
            imageElement.offsetWidth * this.scale -
            this.imageContainer.nativeElement.clientWidth;
          const maxScrollTop =
            imageElement.offsetHeight * this.scale -
            this.imageContainer.nativeElement.clientHeight;

          // Scroll the container within its limits
          this.imageContainer.nativeElement.scrollLeft = Math.min(
            Math.max(
              this.imageContainer.nativeElement.scrollLeft - ev.deltaX,
              0
            ),
            maxScrollLeft
          );
          this.imageContainer.nativeElement.scrollTop = Math.min(
            Math.max(
              this.imageContainer.nativeElement.scrollTop - ev.deltaY,
              0
            ),
            maxScrollTop
          );
        }
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
