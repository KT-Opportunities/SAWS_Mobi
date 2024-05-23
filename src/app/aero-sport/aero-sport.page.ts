import {
  Component,
  inject,
  OnInit,
  ElementRef,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-aero-sport',
  templateUrl: './aero-sport.page.html',
  styleUrls: ['./aero-sport.page.scss'],
})
export class AeroSportPage implements OnInit {
  // Check if the image filename corresponds to TsProbability
  isTsProbability(filename: string): boolean {
    return filename.includes('tsprob_d1.gif') || filename.includes('tsprob_d2.gif');
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
  isLoading: boolean = true;
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
  apiUrl: string = 'http://160.119.253.130/aviappapi/api/RawSource/GetSourceAviationFolderFilesList';
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
    private authService: AuthService,
    private elRef: ElementRef,
    private spinner: NgxSpinnerService,
    private http: HttpClient,

    private APIService: APIService,
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
    this.CloudCoverImage = data.find((item: any) => item.filename.includes('l14_cint_d1'));

    // Find Connective Cloud image
    this.ConnectiveCloudImage = data.find((item: any) => item.filename.includes('cb214_d1'));

    // Find Winds image
    this.WindsImage = data.find((item: any) => item.filename.includes('s8_cint_d1'));

    // Find Thermals image
    this.ThermalsImage = data.find((item: any) => item.filename.includes('lf8_cint_d1'));

    // Find Temperature image
    this.TemperatureImage = data.find((item: any) => item.filename.includes('t11_cint_d1'));

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

    this.APIService.GetSourceAviationFolderFilesListNull(24).subscribe(
      (data) => {
        this.Synoptic = data.filter(
          (item: any) => item.filename === 'synoptic.png'
        );

        console.log('Synoptic:', this.Synoptic);

        this.isLoading = false;
      },
      (error) => {
        console.log('Error fetching JSON data:', error);
        this.isLoading = false;
      }
    );
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.closeAllDropdowns();
    }
  }

  toggleDropdown(dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.isDropdownOpen1 = !this.isDropdownOpen1;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen3 = false;
    }

    if (dropdown === 'dropdown2') {
      this.isDropdownOpen2 = !this.isDropdownOpen2;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen3 = false;
    }
    if (dropdown === 'dropdown3') {
      this.isDropdownOpen3 = !this.isDropdownOpen3;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
    }
    if (dropdown === 'dropdown3') {
      this.isDropdownOpen3 = !this.isDropdownOpen3;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
    }
  }

  selectOption(option: string, dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.selectedOption1 = option;
      this.isDropdownOpen1 = false;
    } else if (dropdown === 'dropdown2') {
      this.selectedOption2 = option;
      this.isDropdownOpen2 = false;
    }
  }

  forecastDropdown(dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.isDropdownOpen1 = !this.isDropdownOpen1;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen5 = false;
    }

    if (dropdown === 'dropdown2') {
      this.isDropdownOpen2 = !this.isDropdownOpen2;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen5 = false;
    }
    if (dropdown === 'dropdown3') {
      this.isDropdownOpen3 = !this.isDropdownOpen3;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen5 = false;
    }

    if (dropdown === 'dropdown4') {
      this.isDropdownOpen4 = !this.isDropdownOpen4;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen5 = false;
    }
    if (dropdown === 'dropdown5') {
      this.isDropdownOpen5 = !this.isDropdownOpen5;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen2 = false;
    }
  }
  closeAllDropdowns() {
    this.isDropdownOpen1 = false;
    this.isDropdownOpen2 = false;
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  toggleFormVisibility() {
    this.isFormVisible = false;
    this.isKwazulNatal = false;
    // this.isFormVisible1 = true;
    this.isFormVisible2 = false;
    this.isFormVisible3 = false;
    this.isSpotGfraph = false;
    this.isCloudForecast = false;
    this.isTSProbability = false;
    if (this.isLoggedIn == true) {
      this.spinner.show();
      this.router.navigate(['/central-interio']);
      
    }
  }
  toggleFormVisibility1() {
    this.isFormVisible = false;
    this.isKwazulNatal = false;
    this.isFormVisible1 = false;
    //this.isFormVisible2 = true;
    this.isFormVisible3 = false;
    this.isSpotGfraph = false;
    this.isCloudForecast = false;
    this.isTSProbability = false;
    this.router.navigate(['/south-west-cape']);
  }
  toggleFormVisibility2() {
    this.isFormVisible = false;
    this.isKwazulNatal = false;
    this.isFormVisible1 = false;
    this.isFormVisible3 = true;
    this.isSpotGfraph = false;
    this.isCloudForecast = false;
    this.isTSProbability = false;
    this.isLoading = true;

    this.Synoptic[0];
    console.log('ARRAY AT 0:', this.Synoptic[0]);
    this.APIService.GetAviationFile('', this.Synoptic[0].filename).subscribe(
      (data) => {
        console.log('IMAGE:', data);
        const imageUrlSynoptic =
          'data:image/gif;base64,' + data.filetextcontent; // Adjust the MIME type accordingly
        this.fileBaseUrlSynoptic =
          this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlSynoptic);
        this.isLoading = false;
        console.log('back to image:', this.fileBaseUrlSynoptic);
      },
      (error) => {
        console.log('Error fetching JSON data:', error);
        this.isLoading = false;
      }
    );
  }
  viewImage(folderName: string, hour: string): void {
    const fileName = `l14_cint_d1_${hour.replace(':', '')}.gif`;
    const apiUrl = `http://160.119.253.130/aviappapi/api/RawSource/GetAviationFile?imagefoldername=${folderName}&imagefilename=${fileName}`;

    // Fetch the image from the server
    this.http.get(apiUrl, { responseType: 'blob' }).subscribe(
      (data: Blob) => {
        // Create an object URL for the image blob
        this.imageUrl = URL.createObjectURL(data);
      },
      (error) => {
        console.error('Error fetching image:', error);
        // Optionally, handle the error or display a message to the user
      }
    );
  }
  
  KwazulNatalToggle() {
    // this.isKwazulNatal=true;
    this.isFormVisible2 = false;
    this.isFormVisible = false;
    this.isKwazulNatal = true;
    this.isFormVisible = false;
    this.isSpotGfraph = false;
    this.isCloudForecast = false;
    this.isTSProbability = false;
    this.router.navigate(['/kwazul-natal']);
  }
  SpotGraphToggle() {
    // this.isKwazulNatal=true;
    this.isFormVisible2 = false;
    this.isFormVisible = false;
    this.isKwazulNatal = false;
    this.isFormVisible = false;
    this.isSpotGfraph = true;
    this.isCloudForecast = false;
    this.isTSProbability = false;
    this.router.navigate(['/landing-page']);
  }
  TSProbability() {
    // this.isKwazulNatal=true;
    debugger;
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
        this.isLoading = false;
      }
    );

    this.isFormVisible2 = false;
    this.isFormVisible = false;
    this.isKwazulNatal = false;
    this.isFormVisible = false;
    this.isSpotGfraph = false;
    this.isCloudForecast = false;
    this.isTSProbability = true;
  }
  aerosportPage() {
    this.router.navigate(['/landing-page']);
  }

  forecastPage() {
    this.isFormVisible = true;
    this.isKwazulNatal = false;
    this.isFormVisible1 = false;
    this.isFormVisible2 = false;
    this.isFormVisible3 = false;
    this.isSpotGfraph = false;
    this.isCloudForecast = false;
    this.isTSProbability = false;
  }
  CloudForecast() {
    // this.isCloudForecast = true;
    // this.isFormVisible = false;
    // this.isKwazulNatal = false;
    // this.isFormVisible1 = false;
    // this.isFormVisible2 = false;
    // this.isFormVisible3 = false;
    // this.isSpotGfraph = false;

    this.router.navigate(['/aero-sport/cloud-cover']);
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
        this.isLoading = false;
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
        this.isLoading = false;
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
