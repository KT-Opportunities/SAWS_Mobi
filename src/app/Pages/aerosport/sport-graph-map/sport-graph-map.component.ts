import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { APIService } from 'src/app/services/apis.service';
@Component({
  selector: 'app-sport-graph-map',
  templateUrl: './sport-graph-map.component.html',
  styleUrls: ['./../aero-sport.page.scss'],
})
export class SportGraphMapComponent implements OnInit {
  // Check if the image filename corresponds to TsProbability
  isTsProbability(filename: string): boolean {
    return (
      filename.includes('tsprob_d1.gif') || filename.includes('tsprob_d2.gif')
    );
  }

  NavigateToAerosport() {
    this.router.navigate(['/aero-sport']);
  }

  // Check if the image filename corresponds to Synoptic
  isSynoptic(filename: string): boolean {
    return filename === 'synoptic.png';
  }

  // Generate the image URL based on the image object
  getImageUrl(image: any): string {
    return `${this.apiUrl}${image.foldername}/${image.filename}`;
  }
  CloudCoverImage: any;
  ConnectiveCloudImage: any;
  WindsImage: any;
  ThermalsImage: any;
  TemperatureImage: any;
  imageUrl: string | null = null;
  isLogged: boolean = false;
  loading: boolean = true;
  isFormVisible: boolean = true;
  isFormVisible1: boolean = false;
  isFormVisible2: boolean = false;
  isFormVisible3: boolean = false;
  isKwazulNatal: boolean = false;
  isSpotGfraph: boolean = false;
  isTSProbability: boolean = false;
  isCloudForecast: boolean = false;
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  isDropdownOpen4: boolean = false;
  isDropdownOpen5: boolean = false;
  selectedOption1: string = 'Wind';
  selectedOption2: string = 'Surface';
  selectedOption3: string = 'Temperature';
  selectedOption4: string = 'Total cloud';
  selectedOption5: string = '2023-03-20 20:00';
  nextday: boolean = true;
  prevday: boolean = false;
  TsProbability: any = [];
  xlFAItems: any[] = [];
  noHyphenAfterXL: any[] = [];
  has3AfterXL: any[] = [];
  remainingItems: any[] = [];
  XL2Files: any[] = [];
  Synoptic: any = [];
  apiUrl: string =
    'http://160.119.253.130/aviappapi/api/RawSource/GetSourceAviationFolderFilesList';
  filenameToDisplayName: { [key: string]: string } = {
    'xl-25.8327.75_spot_d1.gif': 'Haartebeesspoort',
    'xl-25.2527.0_spot_d1.gif': 'Pilanesberg',
    'xl-25.7328.18_spot_d1.gif': 'Pretoria',
    'xl-28.40229.373_spot_d1.gif': 'Van Reenen',
    'xl-27.99824.749_spot_d1.gif': 'Jan Kempdorp ',
    'xl-26.3528.46_spot_d1.gif': 'Dunnottar',
    'xl-24.3531.00_spot_d1.gif': 'Hoeadspruid',
    'xl-25.53327.775_spot_d1.gif': 'Brits A/F',
    'xl-26.038827.587_spot_d1.gif': 'Orient',
  };
  fileBaseUrlNext: SafeResourceUrl;
  fileBaseUrlPrevious: SafeResourceUrl;
  fileBaseUrlSynoptic: SafeResourceUrl;

  constructor(
    private router: Router,
    private APIService: APIService,
    private authService: AuthService,
    private elRef: ElementRef,
    private spinner: NgxSpinnerService,
    private http: HttpClient,

    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    this.fileBaseUrlNext = this.sanitizer.bypassSecurityTrustResourceUrl('');
    this.fileBaseUrlPrevious =
      this.sanitizer.bypassSecurityTrustResourceUrl('');
    this.fileBaseUrlSynoptic =
      this.sanitizer.bypassSecurityTrustResourceUrl('');
  }
  extractAlphabetical(filename: string): string {
    return filename.replace(/[^a-zA-Z]/g, '');
  }

  ngOnInit() {
    // Check if user is logged in
    // this.isLoading = true;

    if (!this.authService.getIsLoggedIn()) {
      // If not logged in, navigate to the login page
      this.router.navigate(['/login']);
    }

    // Display the first TsProbability image

    this.APIService.GetSourceAviationFolderFilesList('aerosport', 24).subscribe(
      (data) => {
        this.TsProbability = data.filter(
          (item: any) =>
            item.filename === 'tsprob_d1.gif' ||
            item.filename === 'tsprob_d2.gif'
        );

        // Find Cloud Cover image
        this.CloudCoverImage = data.find((item: any) =>
          item.filename.includes('l14_cint_d1')
        );

        // Find Connective Cloud image
        this.ConnectiveCloudImage = data.find((item: any) =>
          item.filename.includes('cb214_d1')
        );

        // Find Winds image
        this.WindsImage = data.find((item: any) =>
          item.filename.includes('s8_cint_d1')
        );

        // Find Thermals image
        this.ThermalsImage = data.find((item: any) =>
          item.filename.includes('lf8_cint_d1')
        );

        // Find Temperature image
        this.TemperatureImage = data.find((item: any) =>
          item.filename.includes('t11_cint_d1')
        );

        try {
          console.log('BEFORE FILTER:', data);
          data.forEach((item: any) => {
            if (item.filename.startsWith('xlFA')) {
              this.xlFAItems.push(item);
            } else if (
              item.filename.startsWith('xl') &&
              !item.filename.startsWith('xl-3') &&
              !item.filename.startsWith('xlFA') &&
              !item.filename.endsWith('_spot_d2.gif') &&
              // Check for filenames like xlMorningside_spot_d1.gif
              (/^[a-zA-Z]+$/.test(
                item.filename.substring(2, item.filename.indexOf('_'))
              ) ||
                // Check for filenames like xl-24.2231.02_spot_d1.gif
                (item.filename.startsWith('xl-') &&
                  /^[\d]+\.[\d]+(\.[\d]+)*$/.test(
                    item.filename.substring(3, item.filename.indexOf('_'))
                  )))
            ) {
              this.noHyphenAfterXL.push(item);
              this.noHyphenAfterXL = this.noHyphenAfterXL.filter((item) => {
                return (
                  this.filenameToDisplayName[item.filename] ||
                  this.extractAlphabetical(
                    item.filename.substring(2).split('_spot_d1')[0]
                  )
                );
              });
            }
          });
          const uniqueFilenames = new Set<string>();

          data.forEach((item: any) => {
            if (
              item.filename.startsWith('xlFA') &&
              item.filename.endsWith('_spot_d1.gif')
            ) {
              const baseFilename = item.filename.split('_spot_d1.gif')[0];
              if (!uniqueFilenames.has(baseFilename)) {
                uniqueFilenames.add(baseFilename);
                this.XL2Files.push(item);
              }
            }
          });

          console.log('xlFA Items:', this.XL2Files);
          console.log('No Hyphen After xl:', this.noHyphenAfterXL);

          console.log('DATA2:', this.TsProbability);

          this.loading = false;
        } catch (error) {
          console.log('Error parsing JSON data:', error);
          this.loading = false;
        }
      },
      (error) => {
        console.log('Error fetching JSON data:', error);
        this.loading = false;
      }
    );

    this.APIService.GetSourceAviationFolderFilesListNull(24).subscribe(
      (data) => {
        this.Synoptic = data.filter(
          (item: any) => item.filename === 'synoptic.png'
        );

        console.log('Synoptic:', this.Synoptic);

        this.loading = false;
      },
      (error) => {
        console.log('Error fetching JSON data:', error);
        this.loading = false;
      }
    );
  }

  fetchSecondAPI(folderName: string, fileName: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.APIService.GetAviationFile(folderName, fileName).subscribe(
        (response) => {
          const filetextcontent = response.filetextcontent;
          console.log('DATA2:', this.TsProbability);

          resolve(filetextcontent);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  previousDay() {
    // Add logic for navigating to the previous day
    this.nextday = false;
    this.prevday = true;
    this.TsProbability[0];
    console.log('ARRAY AT 0:', this.TsProbability[0]);
    this.APIService.GetAviationFile(
      this.TsProbability[0].foldername,
      this.TsProbability[0].filename
    ).subscribe(
      (data) => {
        console.log('IMAGE:', data);
        const imageUrlPrevious =
          'data:image/gif;base64,' + data.filetextcontent; // Adjust the MIME type accordingly
        this.fileBaseUrlPrevious =
          this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlPrevious);

        console.log('back to image:', this.fileBaseUrlPrevious);
      },
      (error) => {
        console.log('Error fetching JSON data:', error);
        this.loading = false;
      }
    );
  }

  nextDay() {
    this.nextday = true;
    this.prevday = false;
    this.TsProbability[1];
    this.APIService.GetAviationFile(
      this.TsProbability[1].foldername,
      this.TsProbability[1].filename
    ).subscribe(
      (data) => {
        console.log('IMAGE:', data);
        const imageUrlNext = 'data:image/gif;base64,' + data.filetextcontent; // Adjust the MIME type accordingly
        this.fileBaseUrlNext =
          this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlNext);

        console.log('back to image:', this.fileBaseUrlNext);
      },
      (error) => {
        console.log('Error fetching JSON data:', error);
        this.loading = false;
      }
    );
  }
  ImageViewer(imageName: any) {
    this.router.navigate(['/aero-image-viewer'], {
      state: { names: imageName },
    });
  }
  ImageViewer2(imageName: any) {
    this.router.navigate(['/aero-image-viewer'], {
      state: { names2: imageName },
    });
  }
}
