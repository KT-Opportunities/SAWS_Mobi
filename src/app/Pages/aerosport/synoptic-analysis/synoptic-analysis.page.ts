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
        console.log('Fetched data:', data); // Add this line
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
        const imageUrlSynoptic = 'data:image/png;base64,' + data.filecontent;
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

  NavigateToAerosport() {
    this.router.navigate(['/aero-sport']);
  }
}
