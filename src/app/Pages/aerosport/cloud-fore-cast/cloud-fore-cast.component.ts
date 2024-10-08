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


  isZoomed = false;


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


}
