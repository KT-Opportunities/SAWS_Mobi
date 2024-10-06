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
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';

import { SwiperOptions } from 'swiper/types';
import { ImageModalPage } from '../../image-modal/image-modal.page';
@Component({
  selector: 'app-cloud-fore-cast',
  templateUrl: './cloud-fore-cast.component.html',
  styleUrls: ['./../aero-sport.page.scss'],
})
export class CloudForeCastComponent implements OnInit {
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
  @ViewChild('imageContainer', { static: true }) imageContainer!: ElementRef;

  rotationDegree = 0;
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

      if (this.isZoomed) {
        // Enable zoom
        this.scale = 2; // You can dynamically set this based on user input or pinch scale
        imageElement.style.transform = `scale(${this.scale})`;
        imageElement.style.cursor = 'zoom-out'; // Change cursor to indicate zoom-out

        // Ensure zoom is centered and scrollable
        imageElement.style.transformOrigin = 'center center';
        imageElement.style.position = 'relative'; // Allow movement
        imageElement.style.width = 'auto'; // Adjust width for zooming
        imageElement.style.height = 'auto';

        // Enable scrolling when zoomed in
        this.imageContainer.nativeElement.style.overflow = 'auto';
      } else {
        // Disable zoom
        this.scale = 1; // Reset scale
        imageElement.style.transform = 'scale(1)';
        imageElement.style.cursor = 'zoom-in'; // Change cursor to indicate zoom-in

        // Reset image positioning
        imageElement.style.position = 'relative';
        imageElement.style.width = '100%'; // Reset to full width
        imageElement.style.height = 'auto';

        // Disable scrolling when zoom is off
        this.imageContainer.nativeElement.style.overflow = 'hidden';
      }
    }
  }
 
  setupHammer() {
    const defaultScale = 1;
    const minScrollScale = 1.2;
    const maxScale = 4;

    if (this.imageContainer && this.imageContainer.nativeElement) {
      const hammer = new Hammer(this.imageContainer.nativeElement);
      const imageElement =
        this.imageContainer.nativeElement.querySelector('img');

      // Enable pinch gesture
      hammer.get('pinch').set({ enable: true });

      hammer.on('pinchstart', (ev) => {
        this.pinchStartScale = this.scale;
      });

      hammer.on('pinchmove', (ev) => {
        // Update scale based on pinch gesture
        this.scale = Math.min(
          Math.max(this.pinchStartScale * ev.scale, defaultScale),
          maxScale
        );

        // Enable scrolling if zoomed in
        if (this.scale > minScrollScale) {
          this.imageContainer.nativeElement.style.overflow = 'auto';
          imageElement.style.cursor = 'zoom-out'; // Change cursor during pinch
        } else {
          this.imageContainer.nativeElement.style.overflow = 'hidden';
          imageElement.style.cursor = 'zoom-in'; // Reset cursor
        }

        // Update image transformation
        this.updateImageTransform();
      });

      // Handle pan gestures for scrolling
      hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
      hammer.on('panmove', (ev) => {
        if (this.scale > minScrollScale) {
          // Scroll container within its limits
          this.imageContainer.nativeElement.scrollLeft -= ev.deltaX;
          this.imageContainer.nativeElement.scrollTop -= ev.deltaY;
        }
      });
    }
  }

  updateImageTransform() {
    const imageElement = this.imageContainer.nativeElement.querySelector('img');
    if (imageElement) {
      imageElement.style.transform = `scale(${this.scale}) rotate(${this.rotationDegree}deg)`;
      imageElement.style.transformOrigin = 'center center'; // Ensure zoom from center
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

  rotationAngle: number = 0; // T
  constructor(
    private router: Router,
    private authService: AuthService,
    private APIService: APIService,
    private sanitizer: DomSanitizer,
    private moodalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.getCloudCoverImage(this.folderName, this.lastModifiedHours, 'tc');
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  cloudCoverDropdownProductOpen() {
    this.isDropdownProductOpen = !this.isDropdownProductOpen;
    this.isDropdownFrameOpen = false;
  }

  getCloudCoverImage(foldername: any, time: any, productname: any) {
    this.APIService.GetSourceAviationFolderFilesList(foldername).subscribe(
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
            (filecontent) => {
              const imageUrlNext = 'data:image/gif;base64,' + filecontent;
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
          const filecontent = response.filecontent;
          resolve(filecontent);
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

    this.selectedOptionFrame = selectOption;

    this.displayImage(this.folderName, imagefilename).then((filecontent) => {
      const imageUrlNext = 'data:image/gif;base64,' + filecontent;
      this.fileBaseUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlNext);
    });
  }

  NavigateToAerosport() {
    //this.router.navigate(['/aero-sport']);
    window.history.back();
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
    this.displayImage(this.folderName, fileName).then((filecontent) => {
      const imageUrlNext = 'data:image/gif;base64,' + filecontent;
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
  config: SwiperOptions = {
    zoom: true,
    slidesPerView: 1,
    spaceBetween: 10,
  };
  async openPreview(img: any){
    const modal = await this.moodalCtrl.create({
      component: ImageModalPage,
      componentProps: {
        img // image link passed on click event
      },
      cssClass: 'transparent-modal'
    });
    modal.present();
  }
  rotateImage(): void {
    this.rotation = (this.rotation + 90) % 360; // Rotate by 90 degrees
    this.updateImageTransform();
  }

}
