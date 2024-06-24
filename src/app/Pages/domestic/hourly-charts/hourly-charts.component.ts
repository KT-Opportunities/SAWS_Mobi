import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageViewrPage } from '../../image-viewr/image-viewr.page';

@Component({
  selector: 'app-hourly-charts',
  templateUrl: './hourly-charts.component.html',
  styleUrls: ['./../domestic.page.scss'],
})
export class HourlyChartsComponent implements OnInit {

  isLogged: boolean = false;
  isLoading: boolean = false;
  images: { name: string, url: string }[] = [];
  hourlyChartData: any= []
  // Define the chartData array with the correct structure
chartData: { heading: string; information: string; imageUrl?: string }[] = [
  { heading: 'QNH Colour', information: 'Information about QNH Colour' },
  { heading: 'QNH Greyscale', information: 'Information about QNH Greyscale' },
  { heading: 'Air Temperature Colour', information: 'Information about Air Temperature Colour'},
  { heading: 'Air Temperature Greyscale', information: 'Information about Air Temperature Greyscale'},
  { heading: 'Dewpoint Temperature Colour', information: 'Information about Dewpoint Temperature Colour' },
  { heading: 'Dewpoint Temperature Greyscale', information: 'Information about Dewpoint Temperature Greyscale' }
];


 // Define the time headings
 timeSets: string[][] = [
  ['05Z', '04Z', '03Z', '02Z', '01Z', '00Z'],
  ['11Z', '10Z', '09Z', '08Z', '07Z', '06Z'],
  ['17Z', '16Z', '15Z', '14Z', '13Z', '12Z'],
  ['23Z', '22Z', '21Z', '20Z', '19Z', '18Z']
];

  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private APIService: APIService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchHourlyChartData();
    // this.fetchHourlyChartData();
    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      // this. fetchHourlyChartData();
    }
  }

  
   // Method to fetch hourly chart data
   fetchHourlyChartData() {
    this.isLoading = true;
    this.APIService.fetchHourlyChartData('', 12).subscribe(
      (data: any[]) => {
        console.log('API Response:', data); // Log the API response
        // Check if data is valid and not empty
        if (data && data.length > 0) {
          
          console.log('Chart Data:', this.chartData); // Log the chartData array
        } else {
          console.warn('No valid data found in API response.');
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching wind chart images:', error); // Log error
        this.isLoading = false;
      }
    );
  }
  
  get filteredChartData(): any[] {
    // Define the list of desired headings
    const desiredHeadings = ['QNH Colour', 'QNH Greyscale', 'Air Temperature Colour', 'Air Temperature Greyscale', 'Dewpoint Temperature Colour', 'Dewpoint Temperature Greyscale'];
  
    // Filter the chartData array to include only the charts with desired headings
    return this.chartData.filter(chart => desiredHeadings.includes(chart.heading));
  }
  redirectToTimePage(chartHeading: string, time: string) {
    let baseFileName = '';
    switch (chartHeading) {
        case 'QNH Colour':
            baseFileName = 'qnhC';
            break;
        // Add cases for other chart types if needed
        default:
            console.error('Unsupported chart type.');
            return; // Exit the method if the chart type is not supported
    }

    let fileName: string;

    // For "00Z" time, set the file name to qnhC00.gif
    if (time === '00Z') {
        fileName = baseFileName + '00.gif';
    } else {
        // Construct the file name based on the selected time
        fileName = baseFileName + time + '.gif';
    }

    // Navigate to the image viewer page with the constructed file name
    this.router.navigate(['/view-image'], { queryParams: { filePath: fileName } });
}


  getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

 
  getTimeSetForChart(chart: any): string[] {
    // Assuming chart.heading corresponds to the index in timeSets
    const index = this.chartData.findIndex(item => item.heading === chart.heading);
    if (index !== -1) {
      return this.timeSets[index];
    }
    return [];
  }
  
  openImageViewer(chart: any, time: string) {
    this.isLoading = true;
    console.log('Opening', chart);
  
    let fileName = '';
  
    switch (chart.heading) {
      case 'QNH Colour':
        if (time === 'Most Recent') {
          fileName = 'qnhC.gif'; // Set fileName to the default for 'Most Recent'
        } else {
          fileName = `qnhC${this.getHourFormatted(time)}.gif`;
        }
        break;
      case 'QNH Greyscale':
        if (time === 'Most Recent') {
          fileName = 'qnhCbw.gif'; // Set fileName to the default for 'Most Recent'
        } else {
          fileName = `qnhCbw${this.getHourFormatted(time)}.gif`;
        }
        break;

        case 'Air Temperature Colour':
        if (time === 'Most Recent') {
          fileName = 'airtemp.gif'; // Set fileName to the default for 'Most Recent'
        } else {
          fileName = `airtemp${this.getHourFormatted(time)}.gif`;
        }
        break;

        case 'Air Temperature Greyscale':
        if (time === 'Most Recent') {
          fileName = 'airtempbw.gif'; // Set fileName to the default for 'Most Recent'
        } else {
          fileName = `airtempbw${this.getHourFormatted(time)}.gif`;
        }
        break;

        case 'Dewpoint Temperature Colour':
          if (time === 'Most Recent') {
            fileName = 'dewtemp.gif'; // Set fileName to the default for 'Most Recent'
          } else {
            fileName = `dewtemp${this.getHourFormatted(time)}.gif`;
          }
          break;

          case 'Dewpoint Temperature Greyscale':
            if (time === 'Most Recent') {
              fileName = 'dewtempbw.gif'; // Set fileName to the default for 'Most Recent'
            } else {
              fileName = `dewtempbw${this.getHourFormatted(time)}.gif`;
            }
            break;
      // Handle other chart types similarly
  
      default:
        console.error('Unsupported chart type.');
        this.isLoading = false;
        return; // Exit the method if the chart type is not supported
    }
  
    // Call fetchSecondAPI with an empty folder name and the constructed file name
    this.fetchSecondAPI('', fileName)
      .then((filetextcontent) => {
        this.isLoading = false;
  
        // Open the image viewer with the file content
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = '80%';
        dialogConfig.height = '80%';
        dialogConfig.data = { filetextcontent };
  
        const dialogRef = this.dialog.open(ImageViewrPage, dialogConfig);
  
        // Subscribe to the afterClosed event of the dialog
        dialogRef.afterClosed().subscribe(() => {
          this.isLoading = false;
        });
      })
      .catch((error) => {
        console.error('Error fetching file content:', error);
        this.isLoading = false;
      });
  }
  
  // Helper method to format the hour part of the time string
  private getHourFormatted(time: string): string {
    const hour = parseInt(time.slice(0, -1)); // Extract the hour part from the time string
    return hour < 10 ? '0' + hour : hour.toString(); // Pad single digit hours with '0'
  }
  
fetchSecondAPI(folderName: string, fileName: string): Promise<string> {
  // Return a promise that resolves with filetextcontent
  return new Promise<string>((resolve, reject) => {
    this.APIService.GetAviationFile(folderName, fileName).subscribe(
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

NavigateToDomestic() {
  this.router.navigate(['/domestic']);
}
  
}
