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
import { APIService } from 'src/app/services/apis.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-aero-sport',
  templateUrl: './aero-sport.page.html',
  styleUrls: ['./aero-sport.page.scss'],
})
export class AeroSportPage implements OnInit {
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
  fileBaseUrlNext: SafeResourceUrl;
  fileBaseUrlPrevious: SafeResourceUrl;

  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,

    private http: HttpClient,

    private APIService: APIService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    this.fileBaseUrlNext = this.sanitizer.bypassSecurityTrustResourceUrl('');
    this.fileBaseUrlPrevious =
      this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  ngOnInit() {
    // Check if user is logged in
    // this.isLoading = true;
    if (!this.authService.getIsLoggedIn()) {
      // If not logged in, navigate to the login page
      this.router.navigate(['/login']);
    }
    
    this.APIService.GetSourceAviationFolderFilesList('aerosport', 24).subscribe(
      (data) => {
        try {
          console.log('BEFORE FILTER:', data);
          data.forEach((item: any) => {
            if (item.filename.startsWith('xlFA')) {
              this.xlFAItems.push(item);
            } else if (item.filename.indexOf('-') === -1) {
              this.noHyphenAfterXL.push(item);
            } else {
              const index = item.filename.indexOf('xl') + 2;
              const afterXL = item.filename.substring(index);
              if (afterXL === '3') {
                this.has3AfterXL.push(item);
              } else {
                this.remainingItems.push(item);
              }
            }
          });

          console.log('xlFA Items:', this.xlFAItems);
          console.log('No Hyphen After xl:', this.noHyphenAfterXL);
          console.log('Has 3 After xl:', this.has3AfterXL);
          console.log('Remaining Items:', this.remainingItems);

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
    this.isFormVisible1 = true;
    this.isFormVisible2 = false;
    this.isFormVisible3 = false;
    this.isSpotGfraph = false;
    this.isCloudForecast = false;
    this.isTSProbability = false;
  }
  toggleFormVisibility1() {
    this.isFormVisible = false;
    this.isKwazulNatal = false;
    this.isFormVisible1 = false;
    this.isFormVisible2 = true;
    this.isFormVisible3 = false;
    this.isSpotGfraph = false;
    this.isCloudForecast = false;
    this.isTSProbability = false;
  }
  toggleFormVisibility2() {
    this.isFormVisible = false;
    this.isKwazulNatal = false;
    this.isFormVisible1 = false;
    this.isFormVisible3 = true;
    this.isSpotGfraph = false;
    this.isCloudForecast = false;
    this.isTSProbability = false;

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
  KwazulNatalToggle() {
    // this.isKwazulNatal=true;
    this.isFormVisible2 = false;
    this.isFormVisible = false;
    this.isKwazulNatal = true;
    this.isFormVisible = false;
    this.isSpotGfraph = false;
    this.isCloudForecast = false;
    this.isTSProbability = false;
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
  }
  TSProbability() {
    // this.isKwazulNatal=true;
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

    this.router.navigate (['/aero-sport/cloud-cover'])
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
}
