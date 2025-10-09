import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { APIService } from 'src/app/services/apis.service';
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { ModalController } from '@ionic/angular';
import { ViewSymbolPage } from '../../view-symbol/view-symbol.page';

interface SigwxChart {
  title: string;
  level: string;
  times: string[];
  images: { [time: string]: SafeResourceUrl };
  currentImage?: SafeResourceUrl;
}

@Component({
  selector: 'app-sigwx-charts',
  templateUrl: './sigwx-charts.component.html',
  styleUrls: ['./../domestic.page.scss'],
})
export class SigwxChartsComponent implements OnInit {
  loading: boolean = true;
    item: any;

  Sigwxh: any[] = []; // High level
  Sigwxm: any[] = []; // Additional Low
  Sigwxl: any[] = []; // Low level

  imageTimes = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
  currentImages: { [level: string]: SafeResourceUrl } = {};
   ImageArray: any = [];
  fileBaseUrl: SafeResourceUrl | undefined;
  fileBaseUrlNext: SafeResourceUrl;
  fileBaseUrlPrevious: SafeResourceUrl;
  fileBaseUrlSynoptic: SafeResourceUrl;

  constructor(
    private APIService: APIService,
    private sanitizer: DomSanitizer,
    private modalCtrl: ModalController,
     private router: Router,
     private dialog: MatDialog
  ) {
      this.fileBaseUrlNext = this.sanitizer.bypassSecurityTrustResourceUrl('');
    this.fileBaseUrlPrevious =
      this.sanitizer.bypassSecurityTrustResourceUrl('');
    this.fileBaseUrlSynoptic =
      this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  ngOnInit() {
    this.loadSynopticData();
  }

  loadSynopticData() {
    this.loading = true;
    this.APIService.GetSourceAviationFolderFilesListNull().subscribe(
      (data) => {
        console.log("SIGXT:",data)
        data.forEach((item: any) => {
          const fname = item.filename.toLowerCase();
          if (fname.startsWith('sigwxh')) this.Sigwxh.push(item);
          else if (fname.startsWith('sigwxm')) this.Sigwxm.push(item);
          else if (fname.startsWith('sigwxl')) this.Sigwxl.push(item);
        });
        this.Sigwxh = this.sortImages(this.Sigwxh, 'sigwxh');
this.Sigwxm = this.sortImages(this.Sigwxm, 'sigwxm');
this.Sigwxl = this.sortImages(this.Sigwxl, 'sigwxl');

        console.log("sigwxh:",this.Sigwxh)
        console.log("sigwxm:",this.Sigwxm)
        console.log("sigwxl:",this.Sigwxl);
        // Set most recent images by default
        if (this.Sigwxh.length) this.setMostRecentImage('high', this.Sigwxh);
        if (this.Sigwxm.length) this.setMostRecentImage('additionalLow', this.Sigwxm);
        if (this.Sigwxl.length) this.setMostRecentImage('low', this.Sigwxl);

        this.loading = false;
      },
      (error) => {
        console.error(error);
        this.loading = false;
      }
    );
  }

  setMostRecentImage(level: string, items: any[]) {
    const lastItem = items[items.length - 1];
    const base64 = 'data:image/png;base64,' + lastItem.filecontent;
    this.currentImages[level] = this.sanitizer.bypassSecurityTrustResourceUrl(base64);
  }

  getTimeFromFilenamexh(item: any) {
    return this.extractTime(item, 'sigwxh');
  }
  getTimeFromFilenamexm(item: any) {
    return this.extractTime(item, 'sigwxm');
  }
  getTimeFromFilenamexl(item: any) {
    return this.extractTime(item, 'sigwxl');
  }

extractTime(item: any, prefix: string): string | null {
  const fname = item.filename.toLowerCase();

  if (fname.startsWith(prefix)) {
    // Check for A4-size
    if (fname.endsWith('xx.png')) {
      return 'A4-size images';
    }

    // Extract hour for normal images
    const hourStr = fname.slice(prefix.length, -4);
    const hour = parseInt(hourStr, 10);
    if (!isNaN(hour)) {
      return hour < 10 ? `0${hour}:00` : `${hour}:00`;
    } else {
      return 'most recent';
    }
  }

  return null;
}





  async openImageViewer(imgs: any[]) {
    const modal = await this.modalCtrl.create({
      component: ImageModalPage,
      componentProps: { imgs },
      cssClass: 'transparent-modal',
    });
    await modal.present();
  }
    NavigateToDomestic() {
    this.router.navigate(['/domestic']);
  }
  openImageViewerSymbol(item: any) {
  console.log('File Name:', item);
  
  // Define the folder name
  const folderName = '';
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
// Called when a View button is clicked
ImagesArray(item: any, type: any[]) {
  console.log('ITYEM:', item, ' TYPE:', type);
  let ImageArray = type.filter((x) => x.filename.includes(item));
  console.log('Image arrays:', ImageArray);
  this.ConvertImagesArray(ImageArray);
}


async ImageViewer(imgs: string[]) {
  const modal = await this.modalCtrl.create({
    component: ImageModalPage,
    componentProps: { imgs }, // pass the array
    cssClass: 'transparent-modal',
  });

  modal.onWillDismiss().then(() => {
    this.loading = false;
  });

  await modal.present();
}
ConvertImagesArray(ImageArray: any[]) {
  this.loading = true;
  this.ImageArray = [];

  console.log('IMAGE ARRAY:', ImageArray);

  if (ImageArray.length > 0) {
    const firstImage = ImageArray[0];

    // Pass foldername and filename to the API
    this.APIService.GetAviationFile(firstImage.foldername, firstImage.filename)
      .subscribe(
        (data) => {
          console.log('IMAGE:', data);
          const imageUrl = 'data:image/png;base64,' + data.filecontent;

          this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
          this.ImageArray.push(imageUrl);

          this.ImageViewer(this.ImageArray[0]);
        },
        (error) => {
          console.error('Error fetching JSON data:', error);
          this.loading = false;
        }
      );
  }
}

sortImages(items: any[], prefix: string): any[] {
  const order = [
    'most recent',
    'A4-size images',
    '00:00',
    '03:00',
    '06:00',
    '09:00',
    '12:00',
    '15:00',
    '18:00',
    '21:00'
  ];

  return items
    .map(item => ({
      ...item,
      timeLabel: this.extractTime(item, prefix)
    }))
    .filter(item => item.timeLabel !== null)
    .sort((a, b) => order.indexOf(a.timeLabel!) - order.indexOf(b.timeLabel!));
}
async openImageViewerSymbol2() {
  const modal = await this.modalCtrl.create({
    component: ViewSymbolPage,
    componentProps: {
      imgs: ['../../assets/sxwg.gif'] // can be single image or array
    },
    cssClass: 'transparent-modal'
  });
  await modal.present();
}

}


