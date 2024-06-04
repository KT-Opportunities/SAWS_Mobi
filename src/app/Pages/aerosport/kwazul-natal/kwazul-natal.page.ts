import {
  Component,
  inject,
  OnInit,
  ElementRef,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { APIService } from 'src/app/services/apis.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-kwazul-natal',
  templateUrl: './kwazul-natal.page.html',
  styleUrls: ['./../aero-sport.page.scss'],
})
export class KwazulNatalPage implements OnInit {
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
  //selectedOption1: string = 'Low';
  selectedOption2: string = 'FL060';
  selectedOption3: string = 'Normal';
  selectedOption4: string = 'Total cloud';
  selectedOption5: string = '2023-03-20 20:00';
  nextday: boolean = true;
  prevday: boolean = false;
  TsProbability: any = [];
  KwazulNatal: any = [];
  CloudCover: any = [];
  ConvectiveCloudBase: any = [];
  WindArray: any = [];
  ThermalArray: any = [];
  TemperatureArray: any = [];
  selectedOption = 'Low';

  fileBaseUrlNext: SafeResourceUrl;
  fileBaseUrlPrevious: SafeResourceUrl;
  fileBaseUrlSynoptic: SafeResourceUrl;

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
    this.fileBaseUrlSynoptic =
      this.sanitizer.bypassSecurityTrustResourceUrl('');
  }
  getTimeFromFilename(imageName: string): string {
    const time = imageName.split('_')[0].substring(1); // Extracts the time part after "cb"
    return time === 'tm' ? 'outlook' : `${time}:00`;
  }

  getTimeFromFilename2(imageName: string): string {
    const time = imageName.split('_')[0].substring(2); // Extracts the time part after "cb"
    return time === 'tm' ? 'outlook' : `${time}:00`;
  }
  getTimeFromFilename4(imageName: string): string {
    const time = imageName.split('_')[0].substring(2); // Extracts the time part after "cb"
    return time === 'tm' ? 'outlook' : `${time}:00`;
  }
  getTimeFromFilename3(imageName: string): string {
    const prefix = imageName.split('_')[0]; // Extracts the part before the underscore
    let time: string;

    // Determine how many characters to skip based on the prefix
    if (
      prefix.startsWith('s') ||
      prefix.startsWith('6') ||
      prefix.startsWith('8')
    ) {
      time = prefix.substring(1); // Skip the first character
    } else if (
      prefix.startsWith('10') ||
      prefix.startsWith('12') ||
      prefix.startsWith('14') ||
      prefix.startsWith('16')
    ) {
      time = prefix.substring(2); // Skip the first two characters
    } else {
      time = 'outlook'; // Default case for unexpected prefixes
    }

    // Pad single digit time with leading zero
    const paddedTime = time.length === 1 ? `0${time}` : time;

    return paddedTime === 'tm' ? 'outlook' : `${paddedTime}:00`;
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
        this.KwazulNatal = data.filter((item: any) =>
          item.filename.toLowerCase().includes('kzn')
        );
        console.log('KWAZUL NATAL:', this.KwazulNatal);
        this.CloudCover = this.KwazulNatal.filter(
          (item: { filename: string }) =>
            /^[lmhLMH](([0-9]{1,2})|tm)_kzn_d1\.gif$/i.test(item.filename) // Regex pattern to match "l", "m", "h" followed by one or two digits or "tm"
        ).map((item: { filename: string }) => item.filename);

        console.log('CloudCover:', this.CloudCover);

        this.ConvectiveCloudBase = this.KwazulNatal.filter(
          (item: { filename: string }) =>
            /^cb(([01]?[0-9]|2[0-3])|tm)_kzn_d1\.gif$/i.test(item.filename) // Regex pattern to match "cb" followed by valid hour (0-23) or "tm", then "_kzn_d1.gif" (case insensitive)
        ).map((item: { filename: string }) => item.filename);

        console.log('ConvectiveCloudBase:', this.ConvectiveCloudBase);
        this.WindArray = this.KwazulNatal.filter(
          (item: { filename: string }) =>
            /^[s6810121416].*kzn_d1\.gif$/i.test(item.filename) // Regex pattern to match filenames starting with "s", "6", "8", "10", "12", "14", or "16" (case insensitive)
        ).map((item: { filename: string }) => item.filename);

        console.log('WindArray:', this.WindArray);
        this.ThermalArray = this.KwazulNatal.filter(
          (item: { filename: string }) =>
            /^lf(([01]?[0-9]|2[0-3])|tm)_kzn_d1\.gif$/i.test(item.filename) // Regex pattern to match filenames starting with "lf" (case insensitive), followed by valid hour (0-23) or "tm", then "_kzn_d1.gif"
        ).map((item: { filename: string }) => item.filename);

        console.log('ThermalArray:', this.ThermalArray);
        this.TemperatureArray = this.KwazulNatal.filter(
          (item: { filename: string }) =>
            /^[td][^c].*kzn_d1\.gif$/i.test(item.filename) // Regex pattern to match filenames starting with "t" or "d" (case insensitive) but not followed by "c"
        ).map((item: { filename: string }) => item.filename);

        console.log('TemperatureArray:', this.TemperatureArray);

        //CloudCover:any=[];
        //ConvectiveCloudBase:any=[];
        // WindArray:any=[];
        // ThermalArray:any=[];
        // TemperatureArray:any=[];
        this.isLoading = false;
      },
      (error) => {
        console.log('Error fetching JSON data:', error);
        this.isLoading = false;
      }
    );
  }

  selectOption(option: string, dropdown: string) {
    if (this.selectedOption) {
      this.selectedOption = option;
    }
  }
  selectOption2(option: string, dropdown: string) {
    if (this.selectedOption2) {
      this.selectedOption2 = option;
    }
  }
  selectOption3(option: string, dropdown: string) {
    if (this.selectedOption3) {
      this.selectedOption3 = option;
    }
  }
  getFilteredItems() {
    if (this.selectedOption === 'Low') {
      return this.CloudCover.filter((item: any) => item.startsWith('l'));
    } else if (this.selectedOption === 'Middle') {
      return this.CloudCover.filter((item: any) => item.startsWith('m'));
    } else if (this.selectedOption === 'High') {
      return this.CloudCover.filter((item: any) => item.startsWith('h'));
    } else {
      return this.CloudCover;
    }
  }
  getFilteredItemsWind() {
    if (this.selectedOption2 === 'FL060') {
      return this.WindArray.filter((item: any) => item.startsWith('6'));
    } else if (this.selectedOption2 === 'FL080') {
      return this.WindArray.filter((item: any) => item.startsWith('8'));
    } else if (this.selectedOption2 === 'surface') {
      return this.WindArray.filter((item: any) => item.startsWith('s'));
    } else if (this.selectedOption2 === 'FL100') {
      return this.WindArray.filter((item: any) => item.startsWith('10'));
    } else if (this.selectedOption2 === 'FL120') {
      return this.WindArray.filter((item: any) => item.startsWith('12'));
    } else if (this.selectedOption2 === 'FL140') {
      return this.WindArray.filter((item: any) => item.startsWith('14'));
    } else if (this.selectedOption2 === 'FL160') {
      return this.WindArray.filter((item: any) => item.startsWith('16'));
    } else {
      return this.WindArray;
    }
  }
  getFilteredItemsThermal() {
    if (this.selectedOption3 === 'Normal') {
      return this.TemperatureArray.filter((item: any) => item.startsWith('t'));
    } else if (this.selectedOption3 === 'Dewpoint') {
      return this.TemperatureArray.filter((item: any) => item.startsWith('d'));
    } else {
      return this.TemperatureArray;
    }
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

  NavigateToAerosport() {
    this.router.navigate(['/aero-sport']);
    window.history.back();
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

    console.log("imageName", imageName)
    this.router.navigate(['aero-image-viewer'], {
      state: { kwazulNatal: imageName },
    });
  }
  ImageViewer2(imageName: any) {
    this.router.navigate(['/aero-image-viewer'], {
      state: { kwazulNatal: imageName },
    });
  }
}
