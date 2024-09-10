import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import * as Hammer from 'hammerjs';
@Component({
  selector: 'app-cloud-cover',
  templateUrl: './cloud-cover.component.html',
  styleUrls: ['./cloud-cover.component.scss'],
})
export class CloudCoverComponent implements OnInit {
  @ViewChild('imageElement', { static: false }) imageElement!: ElementRef;
  @ViewChild('sliderMask', { static: false }) sliderMask!: ElementRef;
  scale: number = 1;
  rotation: number = 0;
  isLogged: boolean = false;
  frameArray: any = [];

  selectedOptionProduct: string = 'Total cloud';
  selectedOptionFrame: string = '';
  folderName: string = 'aerosport';
  lastModifiedHours: number = 12;
  loading: boolean = false;

  isDropdownProductOpen: boolean = false;
  isDropdownFrameOpen: boolean = false;

  fileBaseUrl: SafeResourceUrl | undefined;
  currentIndex: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private APIService: APIService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.getCloudCoverImage(this.folderName, this.lastModifiedHours, 'tc');
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');

    this.addGestureListeners();
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  cloudCoverDropdownProductOpen() {
    this.isDropdownProductOpen = !this.isDropdownProductOpen;
    this.isDropdownFrameOpen = false;
  }

  getCloudCoverImage(foldername: any, time: any, productname: any) {
    this.APIService.GetSourceAviationFolderFilesList(
      foldername,
      time
    ).subscribe(
      (response) => {
        // this.frameArray = response;

        //   this.frameArray = response.filter((item: any) =>
        //     item.filename.includes(productname)
        // );

        this.frameArray = response.filter(
          (item: any) =>
            item.filename.startsWith(productname) &&
            /^(l|m|tc|h)\d?_spot_d\d\.gif$/.test(item.filename)
        );

        // item.filename.startsWith('h1_spot')

        console.log('this.frameArray', this.frameArray);

        if (this.frameArray.length > 0) {
          this.selectedOptionFrame = this.frameArray[0].lastmodified;

          this.displayImage(this.folderName, this.frameArray[0].filename).then(
            (filetextcontent) => {
              const imageUrlNext = 'data:image/gif;base64,' + filetextcontent;
              this.fileBaseUrl =
                this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlNext);
            }
          );
        }

        this.loading = false;
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.loading = false;
      }
    );
  }

  displayImage(
    imagefoldername: string,
    imagefilename: string
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.APIService.GetAviationFile(imagefoldername, imagefilename).subscribe(
        (response) => {
          const filetextcontent = response.filetextcontent;
          resolve(filetextcontent);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  cloudCoverDropdownFrameOpen() {
    this.isDropdownFrameOpen = !this.isDropdownFrameOpen;
  }

  selectDropdownProduct(
    selectOption: string,
    dropdown: string,
    imagefilename: string
  ) {
    if (dropdown === 'dropdown1') {
      this.selectedOptionProduct = selectOption;
      this.getCloudCoverImage(
        this.folderName,
        this.lastModifiedHours,
        imagefilename
      );
    }

    if (dropdown === 'dropdown2') {
      this.selectedOptionProduct = selectOption;
      this.getCloudCoverImage(
        this.folderName,
        this.lastModifiedHours,
        imagefilename
      );
    }

    if (dropdown === 'dropdown3') {
      this.selectedOptionProduct = selectOption;
      this.getCloudCoverImage(
        this.folderName,
        this.lastModifiedHours,
        imagefilename
      );
    }
    if (dropdown === 'dropdown4') {
      this.selectedOptionProduct = selectOption;
      this.getCloudCoverImage(
        this.folderName,
        this.lastModifiedHours,
        imagefilename
      );
    }
  }

  selectDropdownFrame(selectOption: string, imagefilename: string) {
    this.selectedOptionFrame = selectOption;

    this.displayImage(this.folderName, imagefilename).then(
      (filetextcontent) => {
        const imageUrlNext = 'data:image/gif;base64,' + filetextcontent;
        this.fileBaseUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlNext);
      }
    );
  }

  NavigateToAerosport() {
    this.router.navigate(['/aero-sport']);
  }

  formatTimestamp(timestamp: string): string {
    let date: Date;
    if (timestamp === '') {
      date = new Date(Date.now());
    } else {
      date = new Date(timestamp);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  previousImage(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.frameArray.length) % this.frameArray.length;

    this.selectedOptionFrame = this.frameArray[this.currentIndex].lastmodified;
    const fileName = this.frameArray[this.currentIndex].filename;
    this.displayImage(this.folderName, fileName).then((filetextcontent) => {
      const imageUrlNext = 'data:image/gif;base64,' + filetextcontent;
      this.fileBaseUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlNext);
    });
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.frameArray.length;

    this.selectedOptionFrame = this.frameArray[this.currentIndex].lastmodified;
    const fileName = this.frameArray[this.currentIndex].filename;

    this.displayImage(this.folderName, fileName).then((filetextcontent) => {
      const imageUrlNext = 'data:image/gif;base64,' + filetextcontent;
      this.fileBaseUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlNext);
    });
  }
  rotateImage(): void {
    this.rotation = (this.rotation + 90) % 360; // Rotate by 90 degrees
    this.updateImageTransform();
  }

  addGestureListeners() {
    const hammer = new Hammer(this.imageElement.nativeElement);

    hammer.get('pinch').set({ enable: true });

    let initialScale = this.scale;

    // Pinch to zoom logic
    hammer.on('pinch', (event) => {
      this.scale = initialScale * event.scale;
      this.updateImageTransform();
    });

    hammer.on('pinchend', () => {
      initialScale = this.scale;
    });
  }

  updateImageTransform(): void {
    if (this.imageElement) {
      this.imageElement.nativeElement.style.transform = `scale(${this.scale}) rotate(${this.rotation}deg)`;
    }
  }

  isZoomed = false;
  @HostListener('dblclick', ['$event'])
  onDoubleClick(event: MouseEvent): void {
    event.preventDefault();
    this.toggleZoom();
  }

  toggleZoom(): void {
    if (!this.imageElement) {
      console.error('Image container is not defined');
      return;
    }

    const imageElement = this.imageElement.nativeElement;
    this.isZoomed = !this.isZoomed;

    if (this.isZoomed) {
      imageElement.style.transform = 'scale(3)'; // Adjust zoom level
      imageElement.style.cursor = 'zoom-out';
      this.imageElement.nativeElement.style.overflow = 'auto'; // Enable scrolling

      // Add margins when zoomed in
      // imageElement.style.marginTop = '946px';
      // imageElement.style.marginLeft = '391px';
    } else {
      imageElement.style.transform = 'scale(1)';
      imageElement.style.cursor = 'zoom-in';
      this.imageElement.nativeElement.style.overflow = 'hidden'; // Disable scrolling

      // Remove margins when not zoomed
      imageElement.style.marginTop = '0';
      imageElement.style.marginLeft = '0';
    }
  }


onPinchStart(event: any) {
  this.isZoomed = true;
}

onPinchEnd(event: any) {
  this.isZoomed = false;
}

onPinch(event: any) {
  this.scale = Math.max(1, Math.min(this.scale * event.scale, 5)); // Adjust zoom limits
  const sliderMaskElement = this.sliderMask.nativeElement;

  // Add or remove scroll capability based on zoom level
  if (this.scale > 1) {
    sliderMaskElement.classList.add('zoom-active');
  } else {
    sliderMaskElement.classList.remove('zoom-active');
  }

  event.preventDefault();
}
}
