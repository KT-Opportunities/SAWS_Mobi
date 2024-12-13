import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { APIService } from 'src/app/services/apis.service';
import { ImageViewrPage } from '../../image-viewr/image-viewr.page';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { ModalController } from '@ionic/angular';

interface WAFItem {
  foldername: string;
  filename: string;
  lastmodified: string;
  filecontent: string;
}

@Component({
  selector: 'app-harmonized-grid',
  templateUrl: './harmonized-grid.page.html',
  // styleUrls: ['./harmonized-grid.page.scss'],
  styleUrls: ['./../forecast.page.scss'],
})
export class HarmonizedGridPage implements OnInit {
  WAF: WAFItem[] = [];
  WAF1: WAFItem[] = [];
  WAF2: WAFItem[] = [];
  WAF3: WAFItem[] = [];
  TsProbability: any = [];
  isLoading: boolean = true;
  fileBaseUrl: SafeResourceUrl;
  ImageArray: any = [];
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private APIService: APIService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private moodalCtrl: ModalController
  ) {
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  forecastPage() {
    window.history.back();
    this.router.navigate(['/forecast']);
  }

  ngOnInit() {
    this.APIService.GetSourceChartFolderFilesList('wafs').subscribe(
      (data) => {
        try {
          this.WAF = this.filterLatestEntries(data);
          console.log('Filtered JSON Data:', this.WAF);

          this.WAF.forEach((item: WAFItem) => {
            if (item.filename.includes('QBRE')) {
              this.WAF1.push(item);
            } else if (item.filename.includes('QIRE')) {
              this.WAF2.push(item);
            } else if (item.filename.includes('QLRE')) {
              this.WAF3.push(item);
            }
          });

          console.log('WAF1:', this.WAF1);
          console.log('WAF2:', this.WAF2);
          console.log('WAF3:', this.WAF3);
          this.isLoading = false;
        } catch (error) {
          console.log('Error parsing JSON data:', error);
          this.isLoading = false;
        }
      },
      (error) => {
        console.log('Error fetching JSON data:', error);
        this.isLoading = false;
      }
    );
  }

  filterLatestEntries(data: WAFItem[]): WAFItem[] {
    const latestEntries = new Map<string, WAFItem>();

    data.forEach((item) => {
      const filename = item.filename;
      if (
        !latestEntries.has(filename) ||
        new Date(item.lastmodified) >
          new Date(latestEntries.get(filename)!.lastmodified)
      ) {
        latestEntries.set(filename, item);
      }
    });

    return Array.from(latestEntries.values());
  }

  getTimeSubstring(filename: string): string {
    return filename.substring(filename.length - 8, filename.length - 4);
  }

  displayHeadingWAF1(filename: string): string {
    const twoDigitsAfterQIRI = filename.substring(14, 18);

    switch (twoDigitsAfterQIRI) {
      case '0600':
      case '0000':
      case '1800':
        return 'Entire Atmosphere';
      default:
        return '';
    }
  }

  displayHeading(filename: string): string {
    const twoDigitsAfterQIRI = filename.substring(4, 6);

    switch (twoDigitsAfterQIRI) {
      case '80':
        return '800_hPa/FL100';
      case '70':
        return '700_hPa/FL100';
      case '60':
        return '600_hPa/FL140';
      case '50':
        return '500_hPa/FL180';
      case '40':
        return '400_hPa/FL240';
      case '30':
        return '300_hPa/FL300';
      case '25':
        return '250_hPa/FL340';
      default:
        return '';
    }
  }

  isLastUpdated(time: string, currentItem: any): boolean {
    const itemsWithSameTime = this.WAF2.filter((item: any) => {
      const itemTime = item.lastmodified.substring(11, 16);
      return itemTime === time;
    });
    return (
      itemsWithSameTime.indexOf(currentItem) === itemsWithSameTime.length - 1
    );
  }

  fetchSecondAPI(folderName: string, fileName: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.APIService.GetChartsFile(folderName, fileName).subscribe(
        (response) => {
          const filecontent = response.filecontent;
          console.log('File Text Content:', filecontent);
          resolve(filecontent);
        },
        (error) => {
          reject(error);
        }
      );
    });
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
    let name = item.split('_')[0];
    console.log('NAME:', name);

    // Ensure you are checking the filename property of each object
    let ImageArray = type.filter((x) => x.filename.includes(name));

    console.log('Image arrays:', ImageArray);
    this.ConvertImagesArray(ImageArray);
  }
  ConvertImagesArray(ImageArray: any[]) {
    this.ImageArray = [];
    console.log('IMAGE ARRAY', ImageArray);
    ImageArray.forEach((element) => {
      this.APIService.GetChartsFile('wafs', element.filename).subscribe(
        (data) => {
          if (data && data.filecontent) {
            const imageUrl = 'data:image/gif;base64,' + data.filecontent;
            this.fileBaseUrl =
              this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
            this.ImageArray.push(imageUrl);
          } else {
            console.error('Invalid image content for:', element.filename);
          }
        },
        (error) => {
          console.error('Error fetching image data:', error);
          this.isLoading = false;
        }
      );
    });
    setTimeout(() => {
      if (this.ImageArray.length > 0) {
        console.log('this.ImageArray:', this.ImageArray.length);
        this.ImageViewer(this.ImageArray);
      } else {
        console.error('No images to display.');
      }
    }, 1000);
  }

  forecastPageNavigation() {
    this.router.navigate(['/forecast']);
  }

  ScrollToTop(value: any) {
    var element = document.getElementById(value);
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}
