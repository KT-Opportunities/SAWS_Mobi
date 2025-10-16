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
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from '../../image-modal/image-modal.page';

@Component({
  selector: 'app-kwazul-natal',
  templateUrl: './kwazul-natal.page.html',
  styleUrls: ['./../aero-sport.page.scss'],
})
export class KwazulNatalPage implements OnInit {
  isLogged: boolean = false;
  loading: boolean = false;

  isTSProbability: boolean = false;
  isCloudForecast: boolean = false;
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  isDropdownOpen4: boolean = false;
  isDropdownOpen5: boolean = false;
  selectedOption1: string = 'Low';
  selectedOption2: string = 'FL060';
  selectedOption3: string = 'Normal';
  selectedOption4: string = 'Total cloud';
  selectedOption5: string = '2023-03-20 20:00';
  nextday: boolean = true;
  prevday: boolean = false;
  TsProbability: any = [];
  centralInterio: any = [];
  CloudCover: any = [];
  KwazulNatal: any = [];
  ConvectiveCloudBase: any = [];
  WindArray: any = [];
  ThermalArray: any = [];
  TemperatureArray: any = [];
  filteredWindData: any = [];

  selectedOption = 'Low';

  fileBaseUrl: SafeResourceUrl;
  ImageArray: any = [];
  filteredConvectiveCloudBase: any = []; // To hold filtered items

  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private http: HttpClient,
    private APIService: APIService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private moodalCtrl: ModalController
  ) {
  
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
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

    this.APIService.GetSourceAviationFolderFilesList('aerosport').subscribe(
      (data) => {
        this.KwazulNatal = data.filter((item: any) =>
          item.filename.toLowerCase().includes('kzn')
        );
        console.log('KWAZUL NATAL:', this.KwazulNatal);
        this.CloudCover = this.KwazulNatal.filter(
          (item: { filename: string }) =>
            /^[lmhLMH](([0-9]{1,2})|tm)_kzn_d1\.gif$/i.test(item.filename) ||
          /^[lmhLMH](([0-9]{1,2})|tm)_kzn_d2\.gif$/i.test(item.filename) // Regex pattern to match "l", "m", "h" followed by one or two digits or "tm"
        ).map((item: { filename: string }) => item.filename);

        console.log('CloudCover:', this.CloudCover);

        this.ConvectiveCloudBase = this.KwazulNatal.filter(
          (item: { filename: string }) =>
            /^cb(([01]?[0-9]|2[0-3])|tm)_kzn_d1\.gif$/i.test(item.filename) ||
          /^cb(([01]?[0-9]|2[0-3])|tm)_kzn_d2\.gif$/i.test(item.filename) // Regex pattern to match "cb" followed by valid hour (0-23) or "tm", then "_kzn_d1.gif" (case insensitive)
        ).map((item: { filename: string }) => item.filename);

        console.log('ConvectiveCloudBase:', this.ConvectiveCloudBase);
        this.WindArray = this.KwazulNatal.filter(
          (item: { filename: string }) =>
            /^[s6810121416].*kzn_d1\.gif$/i.test(item.filename) ||
          /^[s6810121416].*kzn_d2\.gif$/i.test(item.filename) // Regex pattern to match filenames starting with "s", "6", "8", "10", "12", "14", or "16" (case insensitive)
        ).map((item: { filename: string }) => item.filename);

        console.log('WindArray:', this.WindArray);
        this.ThermalArray = this.KwazulNatal.filter(
          (item: { filename: string }) =>
            /^lf(([01]?[0-9]|2[0-3])|tm)_kzn_d1\.gif$/i.test(item.filename)||
          /^lf(([01]?[0-9]|2[0-3])|tm)_kzn_d2\.gif$/i.test(item.filename) // Regex pattern to match filenames starting with "lf" (case insensitive), followed by valid hour (0-23) or "tm", then "_kzn_d1.gif"
        ).map((item: { filename: string }) => item.filename);

        console.log('ThermalArray:', this.ThermalArray);
        this.TemperatureArray = this.KwazulNatal.filter(
          (item: { filename: string }) =>
            /^[td][^c].*kzn_d1\.gif$/i.test(item.filename) ||
          /^[td][^c].*kzn_d2\.gif$/i.test(item.filename) // Regex pattern to match filenames starting with "t" or "d" (case insensitive) but not followed by "c"
        ).map((item: { filename: string }) => item.filename);

        console.log('TemperatureArray:', this.TemperatureArray);

        //CloudCover:any=[];
        //ConvectiveCloudBase:any=[];
        // WindArray:any=[];
        // ThermalArray:any=[];
        // TemperatureArray:any=[];
        this.loading = false;
      },
      (error) => {
        console.log('Error fetching JSON data:', error);
        this.loading = false;
      }
    );
  }

  selectOption(option: string, dropdown: string) {
    if (this.selectedOption) {
      this.selectedOption = option;
      this.filterItems(); // Filter items based on the new selection
    }
  }
  selectOption2(option: string) {
    if (this.selectedOption2 !== option) {
      this.selectedOption2 = option;
      // Call the filtering function here if needed
      this.filterItems();
    }
  }

  selectOption3(option: string, dropdown: string) {
    if (this.selectedOption3) {
      this.selectedOption3 = option;
      this.filterItems();
    }
  }
  
  filterItems() {
    if (this.selectedOption === 'Low') {
      this.filteredConvectiveCloudBase = this.ConvectiveCloudBase.filter(
        (item: any) => item.startsWith('cb00')
      );
    } else if (this.selectedOption === 'Middle') {
      this.filteredConvectiveCloudBase = this.ConvectiveCloudBase.filter(
        (item: any) => item.startsWith('cb12')
      );
    } else if (this.selectedOption === 'High') {
      this.filteredConvectiveCloudBase = this.ConvectiveCloudBase.filter(
        (item: any) => item.startsWith('cb23')
      );
    } else {
      this.filteredConvectiveCloudBase = this.ConvectiveCloudBase;
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
    console.log('ITYEM:', item, ' TYPE:', type);
    let name = item.split('_')[0];
    console.log('NAME:', name);
    let ImageArray = type.filter((x) => x.includes(name));
    console.log('Image arrays:', ImageArray);
    this.ConvertImagesArray(ImageArray);
  }

  ConvertImagesArray(ImageArray: any[]) {
    this.ImageArray = [];
    console.log('IMAGE ARRAY', ImageArray);
    ImageArray.forEach((element) => {
      this.APIService.GetAviationFile('aerosport', element).subscribe(
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

  viewFilter(item: any[], filter: string) {
    return item.filter((x) => x.includes(filter));
  }

   hasData(): boolean {
  return (
    (this.getFilteredItems() && this.getFilteredItems().length > 0) ||
    (this.ConvectiveCloudBase && this.ConvectiveCloudBase.length > 0) ||
    (this.getFilteredItemsWind() && this.getFilteredItemsWind().length > 0) ||
    (this.ThermalArray && this.ThermalArray.length > 0) ||
    (this.getFilteredItemsThermal() && this.getFilteredItemsThermal().length > 0)
  );
}
}
