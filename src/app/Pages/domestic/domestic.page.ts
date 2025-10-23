import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { APIService } from 'src/app/services/apis.service';
import { ImageModalPage } from '../image-modal/image-modal.page';

@Component({
  selector: 'app-domestic',
  templateUrl: './domestic.page.html',
  styleUrls: ['./domestic.page.scss'],
})
export class DomesticPage {
  isLogged: boolean = false;

  loading: boolean = false;
  fileBaseUrl: SafeResourceUrl;
  ImageArray: any = [];
  TsProbability: any = [];
  MetarMaps: any = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private moodalCtrl: ModalController,
    private APIService: APIService,
    private loadingCtrl: LoadingController
  ) {
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  get isFreeSubscription(): boolean {
    return this.authService.getIsFreeSubscription();
  }
  NavigateToWarnings() {
    this.router.navigate(['domestic/warnings']);
  }

  NavigateToFlightDocument() {
    this.router.navigate(['domestic/flight-document']);
  }

  NavigateToWindsCharts() {
    this.router.navigate(['domestic/winds-charts']);
  }

  NavigateToIcaoLocations() {
    this.router.navigate(['domestic/icao-locations']);
  }

  NavigateToTakeOffData() {
    this.router.navigate(['domestic/take-off-data']);
  }

  NavigateToLowLevelWindProfile() {
    this.router.navigate(['domestic/low-level-wind-profile']);
  }

  NavigateToTakeOff() {
    this.router.navigate(['domestic/take-off-data']);
  }
  NavigateToSIGWXCharts() {
    this.router.navigate(['domestic/sigwx-charts']);
  }
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading images...',
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }
  async NavigateToMetarMaps() {
    this.loading = true; // Start loading
    this.APIService.GetSourceAviationFolderFilesListNull().subscribe(
      (data) => {
        this.MetarMaps = data.filter(
          (item: any) => item.filename === 'CP000_None_SOUTH_AFRICA_SAWS.png'
        );
        if (this.MetarMaps.length > 0) {
          this.ImagesArray(this.MetarMaps[0].filename, this.MetarMaps);
        }
        this.loading = false; // Stop loading after processing
      },
      (error) => {
        console.error('Error fetching JSON data:', error);
        this.loading = false; // Stop loading on error
      }
    );
  }

  async NavigateToQnhChart() {
    this.loading = true; // Start loading
    this.APIService.GetSourceAviationFolderFilesListNull().subscribe(
      (data) => {
        this.MetarMaps = data.filter(
          (item: any) => item.filename === 'qnhC00.gif'
        );
        console.log('METARMAPS', this.MetarMaps);
        if (this.MetarMaps.length > 0) {
          this.ImagesArray(this.MetarMaps[0].filename, this.MetarMaps);
        } else {
          this.loading = false; // Stop loading if no maps found
        }
      },
      (error) => {
        console.error('Error fetching JSON data:', error);
        this.loading = false; // Stop loading on error
      }
    );
  }

  NavigateToHourlyCharts() {
    this.router.navigate(['domestic/hourly-charts']);
  }

  NavigateToLandingPage() {
    this.router.navigate(['/landing-page']);
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
    ImageArray.forEach((element) => {
      this.APIService.GetAviationFile(foldername, element.filename).subscribe(
        (data) => {
          console.log('IMAGE:', data);
          const imageUrl = 'data:image/gif;base64,' + data.filecontent; // Adjust the MIME type accordingly

          this.fileBaseUrl =
            this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);

          this.ImageArray.push(imageUrl);
        },
        (error) => {
          console.log('Error fetching JSON data:', error);
          this.loading = false;
        }
      );
    });
    setTimeout(() => {
      console.log('this.ImageArray:', this.ImageArray.length);
      this.ImageViewer(this.ImageArray);
    }, 1000);
  }

  viewFilter(item: any[], filter: string) {
    return item.filter((x) => x.includes(filter));
  }
  viewFilters(items: any[], filter: string) {
    return items.filter((x) => x.filename.includes(filter));
  }
}
