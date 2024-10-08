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
import { SwiperOptions } from 'swiper/types';
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { ModalController } from '@ionic/angular';

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


  isZoomed = false;


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
    private sanitizer: DomSanitizer,
    private moodalCtrl: ModalController
  ) {
    this.fileBaseUrlNext = this.sanitizer.bypassSecurityTrustResourceUrl('');
    this.fileBaseUrlPrevious =
      this.sanitizer.bypassSecurityTrustResourceUrl('');

   
  }

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
  config: SwiperOptions = {
    slidesPerView: 1.5,
    spaceBetween: 20,
    centeredSlides: true,
  };
  async openPreview(img: any) {
    const modal = await this.moodalCtrl.create({
      component: ImageModalPage,
      componentProps: {
        img, // image link passed on click event
      },
      cssClass: 'transparent-modal',
    });
    modal.present();
  }
  
}
