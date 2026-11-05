import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { APIService } from 'src/app/services/apis.service';
import { ImageModalPage } from '../image-modal/image-modal.page';
@Component({
  selector: 'app-aero-sport',
  templateUrl: './aero-sport.page.html',
  styleUrls: ['./aero-sport.page.scss'],
})
export class AeroSportPage implements OnInit {
  loading: boolean = false;
  fileBaseUrl: SafeResourceUrl;
  ImageArray: any = [];
  TsProbability: any = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private moodalCtrl: ModalController,
    private APIService: APIService,
    private alertCtrl: AlertController
  ) {
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  ngOnInit() {
    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  get isFreeSubscription(): boolean {
    return this.authService.getIsFreeSubscription();
  }

  NavigateToCentralInterior() {
    this.router.navigate(['aero-sport/central-interior']);
  }

  NavigateToSouthWesternCape() {
    this.router.navigate(['aero-sport/south-west-cape']);
  }

  NavigateToKwazulNatal() {
    this.router.navigate(['aero-sport/kwazulu-natal']);
  }

  NavigateToSpotGraphMap() {
    this.router.navigate(['aero-sport/spot-graph-map']);
  }

  NavigateToLandingPage() {
    this.router.navigate(['/landing-page']);
  }

  NavigateToCloudForecast() {
    this.router.navigate(['/aero-sport/cloud-fore-cast']);
  }
  NavigateToTSProbability() {
    this.loading = true; // Start loading
    this.APIService.GetSourceAviationFolderFilesList('aerosport').subscribe(
      (data) => {
        try {
          this.TsProbability = data.filter(
            (item: any) =>
              item.filename === 'tsprob_tod.gif' ||
              item.filename === 'tsprob_tom.gif'
          );
          console.log('FILES', this.TsProbability);
          if (this.TsProbability.length > 0) {
            // Set default image URLs
            this.ImagesArray(
              this.TsProbability[0].filename,
              this.TsProbability
            );
          } else {
            this.loading = false; // No files found
            this.showNoImagesAlert();
          }
        } catch (error) {
          console.log('Error parsing JSON data:', error);
          this.loading = false; // Stop loading on error
        }
      },
      (error) => {
        console.log('Error fetching JSON data:', error);
        this.loading = false; // Stop loading on error
      }
    );
  }

  NavigateToSynopticAnalysis() {
    this.loading = true; // Start loading
    this.APIService.GetSourceAviationFolderFilesListNull().subscribe(
      (data) => {
        const filteredData = data.filter(
          (item: any) => item.filename === 'synoptic.png'
        );
        if (filteredData.length > 0) {
          this.ImagesArray(filteredData[0].filename, filteredData);
        } else {
          this.loading = false; // No files found
          this.showNoImagesAlert();
        }
      },
      (error) => {
        console.error('Error fetching JSON data:', error);
        this.loading = false; // Stop loading on error
      }
    );
  }

  async ImageViewer(imgs: any) {
    console.log('The img:', imgs);

    const modal = await this.moodalCtrl.create({
      component: ImageModalPage,
      componentProps: {
        imgs, // image link passed on click event
      },
      cssClass: 'transparent-modal',
    });

    // Listen for the modal will dismiss event
    modal.onWillDismiss().then(() => {
      this.loading = false; // Stop loading when the modal is closed
    });

    await modal.present();
  }

  ImagesArray(item: any, type: any[]) {
    console.log('ITEM:', item, ' TYPE:', type);
    let name = item.split('_')[0];
    console.log('NAME:', name);

    // Ensure you are checking the filename property of each object
    let ImageArray = type.filter((x) => x.filename.includes(name));
    let foldername = ImageArray[0].foldername;
    console.log('Image arrays:', ImageArray);
    this.ConvertImagesArray(ImageArray, foldername);
  }
ConvertImagesArray(ImageArray: any[], foldername: any) {
  this.ImageArray = [];
  console.log('IMAGE ARRAY', ImageArray);

  if (ImageArray.length === 0) {
    // No images available, show default "no data" image
    this.ImageArray.push('assets/nodata.png'); // Make sure it's an array
    this.ImageViewer(this.ImageArray); // Pass array, not string
    return;
  }

  let loadedImages = 0;

  ImageArray.forEach((element) => {
    this.APIService.GetAviationFile(foldername, element.filename).subscribe(
      (data) => {
        const imageUrl = 'data:image/gif;base64,' + data.filecontent;
        this.fileBaseUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);

        this.ImageArray.push(imageUrl);

        loadedImages++;
        if (loadedImages === ImageArray.length) {
          // Pass array to ImageViewer
          this.ImageViewer(this.ImageArray);
        }
      },
      (error) => {
        console.log('Error fetching JSON data:', error);
        loadedImages++;
        if (loadedImages === ImageArray.length && this.ImageArray.length === 0) {
          // All requests failed
          this.ImageArray.push('assets/nodata.png'); // Pass array
          this.ImageViewer(this.ImageArray);
        }
      }
    );
  });
}



  viewFilter(item: any[], filter: string) {
    return item.filter((x) => x.includes(filter));
  }
  viewFilters(items: any[], filter: string) {
    return items.filter((x) => x.filename.includes(filter));
  }
  async showNoImagesAlert() {
  const alert = await this.alertCtrl.create({
    header: 'No Images Available',
    message: 'There are no images to display at the moment.',
    buttons: ['OK'],
  });

  await alert.present();
}

}
