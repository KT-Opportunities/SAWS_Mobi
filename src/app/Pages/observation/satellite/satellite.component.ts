import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { ModalController, ToastController } from '@ionic/angular';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-satellite',
  templateUrl: './satellite.component.html',
  styleUrls: ['./satellite.component.scss'],
})
export class SatelliteComponent implements OnInit {
  isLogged: boolean = false;
  frameArray: any = [];

  isDropdownProductOpen: boolean = false;
  isDropdownFrameOpen: boolean = false;

  selectedOptionProduct: string = 'VIS008';
  selectedOptionFrame: string = '';
  loading: boolean = false;

  fileBaseUrl: SafeResourceUrl | undefined;
  currentIndex: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private APIService: APIService,
    private sanitizer: DomSanitizer,
    private moodalCtrl: ModalController,
    private toastController: ToastController
  ) {}

  config: SwiperOptions = {
    zoom: true,
    slidesPerView: 1,
    spaceBetween: 10,
  };
  async presentForecastToast() {
    const toast = await this.toastController.create({
      message: 'Tap the image to zoom in',
      duration: 3000,
      position: 'top',
      icon: 'information-circle', // Change the icon to the information icon
      cssClass: 'custom-toast', // Custom class for the toast
      buttons: [
        {
          side: 'end',
          text: 'Close',
          role: 'cancel',
        },
      ],
    });

    // Apply custom styles directly to the toast
    toast.classList.add('custom-toast');

    // Set styles directly
    const styles = `
      ion-toast.custom-toast {
        --background: #28a745; /* Green background */
        --color: #ffffff; /* White text */
        --box-shadow: 3px 3px 10px 0 rgba(0, 0, 0, 0.2);
      }
      ion-toast.custom-toast::part(message) {
        font-style: italic;
        color: #ffffff; /* White message text */
      }
      ion-toast.custom-toast::part(icon) {
        color: #ffffff; /* White icon */
      }
      ion-toast.custom-toast::part(button) {
        border-left: 1px solid #d2d2d2;
        color: #ffffff; /* White button text */
        font-size: 12px;
      }
    `;

    // Create a style element and append it to the document
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);

    await toast.present();
  }
  ngOnInit() {
    this.loading = true;
    setTimeout(() => {
      this.presentForecastToast();
    }, 500); // Delay by 500ms
    this.getSatelliteImage('satellite', 12, this.selectedOptionProduct);
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  sateliteDropdownProductOpen() {
    this.isDropdownProductOpen = !this.isDropdownProductOpen;
    this.isDropdownFrameOpen = false;
  }

  getSatelliteImage(foldername: any, time: any, productname: any) {
    this.loading = true;
    this.APIService.GetSourceAviationFolderFilesList(foldername).subscribe(
      (response) => {
        // this.frameArray = response;

        this.frameArray = response.filter((item: any) =>
          item.filename.includes(productname)
        );

        if (this.frameArray.length > 0) {
          this.selectedOptionFrame = this.frameArray[0].lastmodified;

          this.displayImage('satellite', this.frameArray[0].filename).then(
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

  sateliteDropdownFrameOpen() {
    this.isDropdownFrameOpen = !this.isDropdownFrameOpen;
  }

  selectDropdownProduct(selectOption: string, dropdown: string) {
    this.loading = true;
    if (dropdown === 'dropdown1') {
      this.selectedOptionProduct = selectOption;
      this.getSatelliteImage('satellite', 12, selectOption);
    }

    if (dropdown === 'dropdown2') {
      this.selectedOptionProduct = selectOption;
      this.getSatelliteImage('satellite', 12, selectOption);
    }

    if (dropdown === 'dropdown3') {
      this.selectedOptionProduct = selectOption;
      this.getSatelliteImage('satellite', 12, selectOption);
    }
    if (dropdown === 'dropdown4') {
      this.selectedOptionProduct = selectOption;
      this.getSatelliteImage('satellite', 12, selectOption);
    }
    if (dropdown === 'dropdown5') {
      this.selectedOptionProduct = selectOption;
      this.getSatelliteImage('satellite', 12, selectOption);
    }
    if (dropdown === 'dropdown6') {
      this.selectedOptionProduct = selectOption;
      this.getSatelliteImage('satellite', 12, selectOption);
    }
   
  }

  selectDropdownFrame(selectOption: string, imagefilename: string) {
    this.selectedOptionFrame = selectOption;

    this.displayImage('satellite', imagefilename).then((filecontent) => {
      const imageUrlNext = 'data:image/gif;base64,' + filecontent;
      this.fileBaseUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlNext);
    });
  }

  navigateToObservation() {
    this.router.navigate(['/observation']);
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
    this.loading = true;
    this.currentIndex =
      (this.currentIndex - 1 + this.frameArray.length) % this.frameArray.length;

    this.selectedOptionFrame = this.frameArray[this.currentIndex].lastmodified;
    const fileName = this.frameArray[this.currentIndex].filename;
    this.displayImage('satellite', fileName).then((filecontent) => {
      const imageUrlNext = 'data:image/gif;base64,' + filecontent;
      this.fileBaseUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlNext);
    });
    this.loading = false;
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.frameArray.length;

    this.selectedOptionFrame = this.frameArray[this.currentIndex].lastmodified;
    const fileName = this.frameArray[this.currentIndex].filename;

    this.displayImage('satellite', fileName).then((filecontent) => {
      const imageUrlNext = 'data:image/gif;base64,' + filecontent;
      this.fileBaseUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlNext);
    });
  }

  async ImageViewer(imgs: any) {
    console.log('The img:', imgs);

    let formattedImages: string[];

    // Check if imgs is an object with the specific property
    if (
      typeof imgs === 'object' &&
      imgs.changingThisBreaksApplicationSecurity
    ) {
      // Convert it to an array
      formattedImages = [imgs.changingThisBreaksApplicationSecurity];
    } else if (Array.isArray(imgs)) {
      // If imgs is already an array, use it directly
      formattedImages = imgs;
    } else {
      // Handle unexpected formats
      console.error('Unexpected format for imgs:', imgs);
      formattedImages = [];
    }

    const modal = await this.moodalCtrl.create({
      component: ImageModalPage,
      componentProps: {
        imgs: formattedImages, // Pass the formatted array of image links
      },
      cssClass: 'transparent-modal',
    });
    modal.present();
  }
}
