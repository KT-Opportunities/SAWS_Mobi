import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { APIService } from 'src/app/services/apis.service';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ImageViewrPage } from '../Pages/image-viewr/image-viewr.page';
@Component({
  selector: 'app-international',
  templateUrl: './international.page.html',
  styleUrls: ['./international.page.scss'],
})
export class InternationalPage implements OnInit {
  isLogged: boolean = false;
  MaximumArray: any = [];
  ngOnInit() {}
  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  forecastPage() {
    this.router.navigate(['/landing-page']);
  }

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
  selectedOption1: string = 'West';
  selectedOption2: string = 'Surface';
  selectedOption3: string = 'Temperature';
  selectedOption4: string = 'Total cloud';
  selectedOption5: string = '2023-03-20 20:00';
  nextday: boolean = true;
  prevday: boolean = false;
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private APIService: APIService,
    private dialog: MatDialog
  ) {}

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
    //this.isFormVisible2 = true;
    this.isFormVisible3 = false;
    this.isSpotGfraph = false;
    this.isCloudForecast = false;
    this.isTSProbability = false;
    this.router.navigate(['/grid-winds']);
  }
  toggleFormVisibility2() {
    this.isFormVisible = false;
    this.isKwazulNatal = false;
    this.isFormVisible1 = false;
    this.isFormVisible3 = true;
    this.isSpotGfraph = false;
    this.isCloudForecast = false;
    this.isTSProbability = false;
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
  MaximumWind() {
    // this.isKwazulNatal=true;
    this.loading = true;
    debugger;
    this.APIService.GetSourceChartFolderFilesList('PW').subscribe(
      (response) => {
        this.MaximumArray = response;
        console.log('Response:', this.MaximumArray);

        this.MaximumArray = response.filter((item: any) =>
          item.filename.includes('PWRD98')
        );
        console.log('Response after filter:', this.MaximumArray);

        console.log('Response:', this.MaximumArray);
        // const allowedFilenames = [
        //   'PWRD98FAPR290600.png',
        //   'PWRD98FAPR281800.png',
        //   'PWRD98FAPR280600.png',
        //   'PWRD98FAPR290000.png',
        // ];

        // this.MaximumArray = this.MaximumArray.filter((item: any) =>
        //   allowedFilenames.includes(item.filename)
        // );

        console.log('Response:', this.MaximumArray);

        this.loading = false;

        this.loading = false; // Set loading to false after processing
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.loading = false; // Set loading to false in case of error
        // Handle error appropriately (e.g., show error message)
      }
    );

    this.isFormVisible2 = false;
    this.isFormVisible = false;
    this.isKwazulNatal = false;
    this.isFormVisible = false;
    this.isSpotGfraph = true;
    this.isCloudForecast = false;
    this.isTSProbability = false;
  }
  extractTime(filename: string): string {
    const timeMatch = filename.match(/(\d{4})(?=.png$)/);
    if (timeMatch) {
      const timeString = timeMatch[0];
      const hours = timeString.substring(0, 2);
      const minutes = timeString.substring(2, 4);
      return `${hours}:${minutes}`;
    }
    return '';
  }
  openImageViewer(item: any) {
    // Extract folderName and fileName from the current item
    const folderName = item.foldername;
    const fileName = item.filename;
    debugger;
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

  TSProbability() {
    // this.isKwazulNatal=true;
    this.isFormVisible2 = false;
    this.isFormVisible = false;
    this.isKwazulNatal = false;
    this.isFormVisible = false;
    this.isSpotGfraph = false;
    this.isCloudForecast = false;
    this.isTSProbability = true;
  }
  SigmetArmet() {
    // this.isKwazulNatal=true;
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

  Humidity() {
    this.isCloudForecast = true;
    this.isFormVisible = false;
    this.isKwazulNatal = false;
    this.isFormVisible1 = false;
    this.isFormVisible2 = false;
    this.isFormVisible3 = false;
    this.isSpotGfraph = false;
  }

  nextDay() {
    this.nextday = true;
    this.prevday = false;
  }
  previousDay() {
    this.nextday = false;
    this.prevday = true;
  }
}
