import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { APIService } from 'src/app/services/apis.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from '../../image-modal/image-modal.page';

interface WAFItem {
  foldername: string;
  filename: string;
  lastmodified: string;
  filecontent: string;
}

@Component({
  selector: 'app-harmonized-grid',
  templateUrl: './harmonized-grid.page.html',
  styleUrls: ['./../forecast.page.scss'],
})
export class HarmonizedGridPage implements OnInit {
  WAF: WAFItem[] = [];
 turbulenceFiles: WAFItem[] = [];
icingFiles: WAFItem[] = [];
cbCoverageFiles: WAFItem[] = [];
  isLoading: boolean = true;
  fileBaseUrl: SafeResourceUrl;
  ImageArray: any = [];
  timesToDisplay: string[] = ['0000', '0018', '0012']; // Match getForecastTime output

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private APIService: APIService,
    private sanitizer: DomSanitizer,
    private modalCtrl: ModalController
  ) {
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

 ngOnInit() {
  this.APIService.GetSourceAviationFolderFilesList('wafs').subscribe(
    (data) => {
      this.WAF = this.filterLatestEntries(data); // ✅ Keep only latest per file
      console.log('Filtered latest WAF count:', this.WAF.length);

      // Turbulence severity
      this.turbulenceFiles = this.filterLatestEntries(
        this.WAF.filter(item => item.filename.includes('QLRI'))
      );

      // Icing severity
      this.icingFiles = this.filterLatestEntries(
        this.WAF.filter(item => item.filename.includes('QIRE'))
      );

      // Horizontal Extent / CB Coverage
      this.cbCoverageFiles = this.filterLatestEntries(
        this.WAF.filter(item =>
          item.filename.includes('QBRI') 
        )
      );

      this.isLoading = false;
    },
    (error) => {
      console.error('Error fetching data:', error);
      this.isLoading = false;
    }
  );
}



getForecastTime(filename: string): string {
  const match = filename.match(/(\d{6})\.png$/);
  if (!match) return 'unknown';

  const hhmm = match[1].slice(2); // last 4 digits HHMM

  // Map to display times
  switch (hhmm) {
    case '0000': return '0012'; // swap 0000 → 0012
    case '1200': return '0000'; // swap 1200 → 0000
    case '0600': return '0018'; // swap 0600 → 0018
    case '0600': return '0018'; // swap 1800 → 0018
    default: return 'unknown';
  }
}

filterLatestEntries(data: WAFItem[]): WAFItem[] {
  const latestEntries = new Map<string, WAFItem>();

  data.forEach((item) => {
    const forecastTime = this.getForecastTime(item.filename); // 0000 / 0012 / 0018
    const match = item.filename.match(/(QLRI|QIRE|QBRE|QBRI)(\d{2,3})/);
    const type = match?.[1] || 'UNKNOWN';
    const level = match?.[2] || '000';

    // Group by type + level + forecast time
    const key = `${type}_${level}_${forecastTime}`;

    if (
      !latestEntries.has(key) ||
      new Date(item.lastmodified) >
        new Date(latestEntries.get(key)!.lastmodified)
    ) {
      latestEntries.set(key, item);
    }
  });

  return Array.from(latestEntries.values());
}


getLatestByTime(arr: WAFItem[], time: string): WAFItem[] {
  const itemsAtTime = arr.filter(i => this.getForecastTime(i.filename) === time);

  // Sort by level descending (FL height)
  return itemsAtTime.sort((a, b) => {
    const levelA = parseInt(a.filename.match(/Q(?:B|I|L)RE?(\d{2,3})/)?.[1] || '0', 10);
    const levelB = parseInt(b.filename.match(/Q(?:B|I|L)RE?(\d{2,3})/)?.[1] || '0', 10);
    return levelB - levelA; // descending
  });
}


  displayHeading(filename: string): string {
    const code = filename.substring(4, 6);
    switch (code) {
      case '80': return '800_hPa/FL060';
      case '70': return '700_hPa/FL100';
      case '60': return '600_hPa/FL140';
      case '50': return '500_hPa/FL180';
      case '40': return '400_hPa/FL240';
      case '30': return '300_hPa/FL300';
      case '25': return '250_hPa/FL340';
      default: return '';
    }
  }

  displayHeadingWAF1(): string {
    return 'Entire Atmosphere';
  }

  async ImageViewer(imgs: any) {
    const modal = await this.modalCtrl.create({
      component: ImageModalPage,
      componentProps: { imgs },
      cssClass: 'transparent-modal',
    });
    await modal.present();
  }

  ImagesArray(item: any, type: WAFItem[]) {
    const name = item.split('_')[0];
    const images = type.filter((x) => x.filename.includes(name));
    this.ConvertImagesArray(images);
  }

  ConvertImagesArray(ImageArray: WAFItem[]) {
    this.ImageArray = [];
    ImageArray.forEach((el) => {
      this.APIService.GetAviationFile('wafs', el.filename).subscribe((data) => {
        if (data?.filecontent) {
          const imageUrl = 'data:image/gif;base64,' + data.filecontent;
          this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
          this.ImageArray.push(imageUrl);
        }
      });
    });

    setTimeout(() => {
      if (this.ImageArray.length) this.ImageViewer(this.ImageArray);
    }, 1000);
  }

  forecastPageNavigation() { this.router.navigate(['/forecast']); }
  ScrollToTop(value: string) { document.getElementById(value)?.scrollIntoView({ behavior: 'smooth' }); }

  filterFiles(type: 'QLRI' | 'QIRE' | 'QBRE', time?: string): WAFItem[] {
  return this.WAF.filter(item =>
    item.filename.includes(type) &&
    (!time || this.getForecastTime(item.filename) === time)
  );
}

}
