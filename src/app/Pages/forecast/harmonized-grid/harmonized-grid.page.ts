import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { APIService } from 'src/app/services/apis.service';
import { ImageViewrPage } from '../../image-viewr/image-viewr.page';

interface WAFItem {
  foldername: string;
  filename: string;
  lastmodified: string;
  filetextcontent: string;
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

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private APIService: APIService,
    private dialog: MatDialog
  ) {}

  forecastPage() {
    window.history.back();
    this.router.navigate(['/forecast']);
  }

  ngOnInit() {
    this.APIService.GetSourceAviationFolderFilesList('aerosport', 24).subscribe(
      (data) => {
        try {
          this.TsProbability = data.filter(
            (item: any) =>
              item.filename === 'tsprob_d1.gif' ||
              item.filename === 'tsprob_d2.gif'
          );

          console.log('DATA2:', this.TsProbability);

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

  openImageViewer(item: any) {
    console.log('file Name:', item);
    const folderName = item.foldername;
    const fileName = item.filename;
    console.log('Folder Name:', folderName);
    this.isLoading = true;

    this.fetchSecondAPI(folderName, fileName)
      .then((filetextcontent) => {
        this.isLoading = false;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = '80%';
        dialogConfig.height = '80%';
        dialogConfig.data = { filetextcontent };

        const dialogRef = this.dialog.open(ImageViewrPage, dialogConfig);

        dialogRef.afterClosed().subscribe(() => {
          this.isLoading = false;
        });
      })
      .catch((error) => {
        console.error('Error fetching file content:', error);
        this.isLoading = false;
      });
  }

  fetchSecondAPI(folderName: string, fileName: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.APIService.GetChartsFile(folderName, fileName).subscribe(
        (response) => {
          const filetextcontent = response.filetextcontent;
          console.log('File Text Content:', filetextcontent);
          resolve(filetextcontent);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  forecastPageNavigation() {
    this.router.navigate(['/forecast']);
  }

  ScrollToTop(value: any) {
    var element = document.getElementById(value);
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}
