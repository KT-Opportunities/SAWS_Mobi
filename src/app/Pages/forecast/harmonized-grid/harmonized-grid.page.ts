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
  WAF: any = [];
  WAF1: any = [];
  WAF2: any = [];
  WAF3: any = [];
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
    // this.APIService.GetSourceChartFolderFilesList('wafs').subscribe(
    //   (Response) => {
    //     this.WAF = Response;
    //     console.log('WAF:', this.WAF);
    //     this.WAF.forEach((item: any) => {
    //       // Explicitly type 'item' as 'any' or the appropriate type
    //       // Check the filename to determine which array to push into
    //       if (item.filename.includes('QBRE')) {
    //         this.WAF1.push(item);
    //       } else if (item.filename.includes('QIRE')) {
    //         this.WAF2.push(item);
    //       } else if (item.filename.includes('QLRE')) {
    //         this.WAF3.push(item);
    //       }
    //     });
    //     console.log('WAF1:', this.WAF1);
    //     console.log('WAF2:', this.WAF2);
    //     console.log('WAF3:', this.WAF3);
    //   }
    // );
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
          this.WAF = data;
          console.log('JSON Data:', this.WAF);

          this.WAF.forEach((item: any) => {
            // Explicitly type 'item' as 'any' or the appropriate type
            // Check the filename to determine which array to push into
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
  getTimeSubstring(filename: string): string {
    // Extract the last 4 characters from the filename
    const timeSubstring = filename.substring(
      filename.length - 8,
      filename.length - 4
    );

    return timeSubstring;
  }

  displayHeadingWAF1(filename: string): string {
    const twoDigitsAfterQIRI = filename.substring(14, 18);

    switch (twoDigitsAfterQIRI) {
      case '0600':
        return 'EntireAtmosphere';
      case '0000':
        return 'EntireAtmosphere';
      case '1800':
        return 'EntireAtmosphere';
      default:
        return ''; // Default case if none of the above matches
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
        return ''; // Default case if none of the above matches
    }
  }

  isLastUpdated(time: string, currentItem: any): boolean {
    const itemsWithSameTime = this.WAF2.filter((item: any) => {
      // Extract the time substring from the lastmodified property
      const itemTime = item.lastmodified.substring(11, 16); // Extracts HH:MM from the timestamp
      return itemTime === time;
    });
    return (
      itemsWithSameTime.indexOf(currentItem) === itemsWithSameTime.length - 1
    );
  }
  openImageViewer(item: any) {
    // Extract folderName and fileName from the current item
    const folderName = item.foldername;
    const fileName = item.filename;
    console.log('file Name:', fileName);

    // Call fetchSecondAPI to get filetextcontent asynchronously
    this.fetchSecondAPI(folderName, fileName).then((filetextcontent) => {
      // Once filetextcontent is retrieved, open the dialog with necessary data
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.width = '80%'; // Set custom width
      dialogConfig.height = '80%'; // Set custom height
      dialogConfig.data = {
        filetextcontent: filetextcontent,
        // Add any additional data you want to pass to the dialog here
      };

      const dialogRef = this.dialog.open(ImageViewrPage, dialogConfig);
    });
  }

  fetchSecondAPI(folderName: string, fileName: string): Promise<string> {
    // Return a promise that resolves with filetextcontent
    return new Promise<string>((resolve, reject) => {
      this.APIService.GetChartsFile(folderName, fileName).subscribe(
        (response) => {
          // Assuming filetextcontent is obtained from the response
          const filetextcontent = response.filetextcontent;
          // Log filetextcontent to verify
          console.log('File Text Content:', filetextcontent);
          // Resolve the promise with filetextcontent
          resolve(filetextcontent);
        },
        (error) => {
          // Reject the promise if there's an error
          reject(error);
        }
      );
    });
  }
}
