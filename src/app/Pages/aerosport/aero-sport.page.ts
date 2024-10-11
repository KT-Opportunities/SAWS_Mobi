import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
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
    private APIService: APIService
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
              item.filename === 'tsprob_d1.gif' ||
              item.filename === 'tsprob_d2.gif'
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
