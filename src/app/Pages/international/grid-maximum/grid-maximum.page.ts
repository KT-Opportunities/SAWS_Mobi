import {
  Component,
  inject,
  OnInit,
  ElementRef,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { APIService } from 'src/app/services/apis.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { ImageViewrPage } from '../../image-viewr/image-viewr.page';

@Component({
  selector: 'app-grid-maximum',
  templateUrl: './grid-maximum.page.html',
  styleUrls: ['./../international.page.scss'],
})
export class GridMaximumPage implements OnInit {
  isLogged: boolean = false;
  isLoading: boolean = false;

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
  MaximumArray: any = [];
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

  ngOnInit() {
    // Check if user is logged in
    // this.isLoading = true;

    if (!this.authService.getIsLoggedIn()) {
      // If not logged in, navigate to the login page
      this.router.navigate(['/login']);
    }
    this.isLoading = true;
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

        this.isLoading = false; // Set loading to false after processing
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.isLoading = false; // Set loading to false in case of error
        // Handle error appropriately (e.g., show error message)
      }
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

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.closeAllDropdowns();
    }
  }

  closeAllDropdowns() {
    this.isDropdownOpen1 = false;
    this.isDropdownOpen2 = false;
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  NavigateToInternational() {
    this.router.navigate(['/international']);
  }
}
