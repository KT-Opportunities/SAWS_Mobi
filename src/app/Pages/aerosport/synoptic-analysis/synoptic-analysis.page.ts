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
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { SwiperOptions } from 'swiper/types';

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
    private cdr: ChangeDetectorRef,
    private moodalCtrl: ModalController
  ) {}
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



  isZoomed = false;


  NavigateToAerosport() {
    this.router.navigate(['/aero-sport']);
  }
}
