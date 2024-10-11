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
  selector: 'app-hourly-charts',
  templateUrl: './hourly-charts.component.html',
  styleUrls: ['./../domestic.page.scss'],
})
export class HourlyChartsComponent implements OnInit {
  isLogged: boolean = false;
  loading: boolean = false;
  images: { name: string; url: string }[] = [];
  hourlyChartData: any = [];

  fileBaseUrl: SafeResourceUrl;
  ImageArray: any = [];
  // Define the chartData array with the correct structure
  chartData: { heading: string; information: string; imageUrl?: string }[] = [
    { heading: 'QNH Colour', information: 'Information about QNH Colour' },
    {
      heading: 'QNH Greyscale',
      information: 'Information about QNH Greyscale',
    },
    {
      heading: 'Air Temperature Colour',
      information: 'Information about Air Temperature Colour',
    },
    {
      heading: 'Air Temperature Greyscale',
      information: 'Information about Air Temperature Greyscale',
    },
    {
      heading: 'Dewpoint Temperature Colour',
      information: 'Information about Dewpoint Temperature Colour',
    },
    {
      heading: 'Dewpoint Temperature Greyscale',
      information: 'Information about Dewpoint Temperature Greyscale',
    },
  ];

  // Define the time headings
  timeSets: string[][] = [
    ['05Z', '04Z', '03Z', '02Z', '01Z', '00Z'],
    ['11Z', '10Z', '09Z', '08Z', '07Z', '06Z'],
    ['17Z', '16Z', '15Z', '14Z', '13Z', '12Z'],
    ['23Z', '22Z', '21Z', '20Z', '19Z', '18Z'],
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
    private cdr: ChangeDetectorRef,
    private moodalCtrl: ModalController
  ) {
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

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
    this.loading = true;
    this.APIService.fetchHourlyChartData('').subscribe(
      (data: any[]) => {
        console.log('API Response:', data); // Log the API response
        // Check if data is valid and not empty
        if (data && data.length > 0) {
          console.log('Chart Data:', this.chartData); // Log the chartData array
        } else {
          console.warn('No valid data found in API response.');
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching wind chart images:', error); // Log error
        this.loading = false;
      }
    );
  }

  get filteredChartData(): any[] {
    // Define the list of desired headings
    const desiredHeadings = [
      'QNH Colour',
      'QNH Greyscale',
      'Air Temperature Colour',
      'Air Temperature Greyscale',
      'Dewpoint Temperature Colour',
      'Dewpoint Temperature Greyscale',
    ];

    // Filter the chartData array to include only the charts with desired headings
    return this.chartData.filter((chart) =>
      desiredHeadings.includes(chart.heading)
    );
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
    this.router.navigate(['/view-image'], {
      queryParams: { filePath: fileName },
    });
  }

  getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getTimeSetForChart(chart: any): string[] {
    // Assuming chart.heading corresponds to the index in timeSets
    const index = this.chartData.findIndex(
      (item) => item.heading === chart.heading
    );
    if (index !== -1) {
      return this.timeSets[index];
    }
    return [];
  }

  // Helper method to format the hour part of the time string
  private getHourFormatted(time: string): string {
    const hour = parseInt(time.slice(0, -1)); // Extract the hour part from the time string
    return hour < 10 ? '0' + hour : hour.toString(); // Pad single digit hours with '0'
  }

  fetchSecondAPI(folderName: string, fileName: string): Promise<string> {
    // Return a promise that resolves with filecontent
    return new Promise<string>((resolve, reject) => {
      this.APIService.GetAviationFile(folderName, fileName).subscribe(
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

  NavigateToDomestic() {
    this.router.navigate(['/domestic']);
  }
  openImageViewer(chart: any, time: string) {
    this.loading = true; // Set loading to true initially
    console.log('Opening', chart);

    let fileName = '';

    // Construct the filename based on the chart type and time
    switch (chart.heading) {
      case 'QNH Colour':
        fileName =
          time === 'Most Recent'
            ? 'qnhC.gif'
            : `qnhC${this.getHourFormatted(time)}.gif`;
        break;
      case 'QNH Greyscale':
        fileName =
          time === 'Most Recent'
            ? 'qnhCbw.gif'
            : `qnhCbw${this.getHourFormatted(time)}.gif`;
        break;
      case 'Air Temperature Colour':
        fileName =
          time === 'Most Recent'
            ? 'airtemp.gif'
            : `airtemp${this.getHourFormatted(time)}.gif`;
        break;
      case 'Air Temperature Greyscale':
        fileName =
          time === 'Most Recent'
            ? 'airtempbw.gif'
            : `airtempbw${this.getHourFormatted(time)}.gif`;
        break;
      case 'Dewpoint Temperature Colour':
        fileName =
          time === 'Most Recent'
            ? 'dewtemp.gif'
            : `dewtemp${this.getHourFormatted(time)}.gif`;
        break;
      case 'Dewpoint Temperature Greyscale':
        fileName =
          time === 'Most Recent'
            ? 'dewtempbw.gif'
            : `dewtempbw${this.getHourFormatted(time)}.gif`;
        break;
      default:
        console.error('Unsupported chart type.');
        this.loading = false; // Set loading to false if unsupported
        return; // Exit if chart type is not supported
    }

    // Fetch the image content and open the viewer
    this.fetchSecondAPI('', fileName)
      .then((filecontent) => {
        this.loading = false; // Stop loading

        // Create the image URL
        const imageUrl = 'data:image/gif;base64,' + filecontent; // Adjust MIME type if necessary

        // Open the ImageViewer modal with the image URL
        this.ImageViewer([imageUrl]); // Wrap in an array if ImageViewer expects an array
      })
      .catch((error) => {
        console.error('Error fetching file content:', error);
        this.loading = false; // Stop loading
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
}
