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
import { AuthService } from 'src/app/services/auth.service';
import { APIService } from 'src/app/services/apis.service';
import { ImageViewrPage } from '../../image-viewr/image-viewr.page';
import { ViewSymbolPage } from '../../view-symbol/view-symbol.page';
import { ViewDecodedPage } from '../../view-decoded/view-decoded.page';
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-sigwx-charts',
  templateUrl: './sigwx-charts.component.html',
  styleUrls: ['./../domestic.page.scss'],
})
export class SigwxChartsComponent implements OnInit {
  imageUrl: string | null = null;
  isLogged: boolean = false;
  loading: boolean = true;
  Sigwx: any = [];
  Sigwxh: any = [];
  Sigwxm: any = [];
  Sigwxl: any = [];
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
    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.loadSynopticData();
    }
  }

  getTimeFromFilenamexh(item: any) {
    // Extract filename without extension
    const filename = item.filename;

    // Check if filename starts with "sigwxh" and ends with ".gif"
    if (filename.startsWith('sigwxh') && filename.endsWith('.gif')) {
      // Remove "sigwxh" from the filename and strip the ".gif" extension
      const timeString = filename.slice(6, -4);

      // Check if timeString is empty, if so, return "A4-size images\nmost recent"
      if (timeString) {
        const hour = parseInt(timeString, 10);
        if (!isNaN(hour)) {
          // Return formatted hour as HH:00
          return hour < 10 ? `0${hour}:00` : `${hour}:00`;
        } else {
          return 'most recent';
        }
      } else {
        // timeString is empty after removing "sigwxh" and ".gif"
        return 'most recent';
      }
    }
    return null;
  }

  getTimeFromFilenamexm(item: any) {
    // Extract filename without extension
    const filename = item.filename;

    // Check if filename starts with "sigwxh" and ends with ".gif"
    if (filename.startsWith('sigwxm') && filename.endsWith('.gif')) {
      // Remove "sigwxh" from the filename and strip the ".gif" extension
      const timeString = filename.slice(6, -4);

      // Check if timeString is empty, if so, return "A4-size images\nmost recent"
      if (timeString) {
        const hour = parseInt(timeString, 10);
        if (!isNaN(hour)) {
          // Return formatted hour as HH:00
          return hour < 10 ? `0${hour}:00` : `${hour}:00`;
        } else {
          return 'most recent';
        }
      } else {
        // timeString is empty after removing "sigwxh" and ".gif"
        return 'most recent';
      }
    }
    return null;
  }

  getTimeFromFilenamexl(item: any) {
    const filename = item.filename;

    // Check if filename starts with "sigwxh" and ends with ".gif"
    if (filename.startsWith('sigwxl') && filename.endsWith('.gif')) {
      // Remove "sigwxh" from the filename and strip the ".gif" extension
      const timeString = filename.slice(6, -4);

      // Check if timeString is empty, if so, return "A4-size images\nmost recent"
      if (timeString) {
        const hour = parseInt(timeString, 10);
        if (!isNaN(hour)) {
          // Return formatted hour as HH:00
          return hour < 10 ? `0${hour}:00` : `${hour}:00`;
        } else {
          return 'most recent';
        }
      } else {
        // timeString is empty after removing "sigwxh" and ".gif"
        return 'most recent';
      }
    }
    return null;
  }

  loadSynopticData() {
    this.loading = true;
    this.APIService.GetSourceAviationFolderFilesListNull().subscribe(
      (data) => {
        console.log('SIGWX', data);

        data.forEach((item: any) => {
          const itemStr = JSON.stringify(item).toLowerCase();
          if (itemStr.includes('sig')) {
            if (itemStr.includes('xh')) {
              this.Sigwxh.push(item);
            } else if (itemStr.includes('xm')) {
              this.Sigwxm.push(item);
            } else if (itemStr.includes('xl')) {
              this.Sigwxl.push(item);
            }
          }
          if (itemStr.includes('ss')) {
            this.Sigwx.push(item);
          }
        });

        this.loading = false;
        console.log('SIGWXH', this.Sigwxh);
        console.log('SIGWXM', this.Sigwxm);
        console.log('SIGWXL', this.Sigwxl);
        console.log('SSIGW', this.Sigwx);
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching JSON data:', error);
        this.loading = false;
      }
    );
  }

  openImageViewerSymbol(item: any) {
    console.log('File Name:', item);
    
    // Define the folder name
    const folderName = 'sigw';
    const fileName = item;
    console.log('Folder Name:', folderName);
  
    // Create the array to hold folderName and fileName
    const type = [
      { folderName: folderName, filename: fileName },
      // Add more entries if needed
    ];
  
    // Call the ImagesArray method with item and the type array
    this.ImagesArray(item, type);
  
  
  }
  item: any;


  fetchSecondAPI(folderName: string, fileName: string): Promise<string> {
    // Return a promise that resolves with filecontent
    return new Promise<string>((resolve, reject) => {
      this.APIService.GetAviationFile('', fileName).subscribe(
        (response) => {
          // Assuming filecontent is obtained from the response
          const filecontent = response.filecontent;
          // Log filecontent to verify
          console.log('File Text Content:', filecontent);
          // Resolve the promise with filecontent
          resolve(filecontent);
        },
        (error) => {
          // Reject the promise if there's an error
          reject(error);
        }
      );
    });
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
