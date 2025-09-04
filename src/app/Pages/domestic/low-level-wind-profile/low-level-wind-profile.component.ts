import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageViewrPage } from '../../image-viewr/image-viewr.page';
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from '../../image-modal/image-modal.page';

@Component({
  selector: 'app-low-level-wind-profile',
  templateUrl: './low-level-wind-profile.component.html',
  // styleUrls: ['./low-level-wind-profile.component.scss'],
  styleUrls: ['./../domestic.page.scss'],
})
export class LowLevelWindProfileComponent implements OnInit {
  isLogged: boolean = false;
  loading: boolean = false;
  lowLevel: any = [];
  fileBaseUrl: SafeResourceUrl;
  ImageArray: any = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private APIService: APIService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private moodalCtrl: ModalController
  ) {
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  ngOnInit() {
    this.loading = true;
    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      // fetch low level wind profile
    }
    this.APIService.GetSourceAviationFolderFilesList('').subscribe(
      (data) => {
        console.log('Data received:', data);

        this.lowLevel = data.filter((item: { filename: string }) =>
          item.filename.includes('up')
        );
        console.log('lowLevel:', this.lowLevel);

        this.loading = false;
      },
      (error) => {
        console.log('Error fetching JSON data:', error);
        this.loading = false;
      }
    );
  }

 transformFilename(filename: string): string {
  if (filename.startsWith('up') && filename.endsWith('.gif')) {
    return filename.slice(2, -4); // remove "up" (first 2 chars) and ".gif" (last 4 chars)
  }
  return filename;
}


  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  NavigateToDomestic() {
    this.router.navigate(['/domestic']);
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
    modal.present();
  }

  ImagesArray(item: any, type: any[]) {
    console.log('ITEM:', item, ' TYPE:', type);

    // Ensure you are checking the filename property of each object
    let ImageArray = type.filter((x) => x.filename.includes(item.filename));

    console.log('Image arrays:', ImageArray);
    this.ConvertImagesArray(ImageArray);
  }

  ConvertImagesArray(ImageArray: any[]) {
    this.ImageArray = [];
    console.log('IMAGE ARRAY', ImageArray);
    ImageArray.forEach((element) => {
      this.APIService.GetAviationFile('', element.filename).subscribe(
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
