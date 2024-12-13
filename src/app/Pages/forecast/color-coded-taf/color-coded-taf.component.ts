import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ViewDecodedPage } from '../../view-decoded/view-decoded.page';
import { DatePipe } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { Keyboard } from '@capacitor/keyboard';
import { Platform } from '@ionic/angular';

interface FileData {
  foldername: string;
  filename: string;
  lastmodified: string;
  filecontent: string;
}

@Component({
  selector: 'app-taf-accuracy-taf',
  templateUrl: './color-coded-taf.component.html',
  styleUrls: ['./../forecast.page.scss'],
})
export class ColorCodedTafComponent implements OnInit, OnDestroy {
  loading = false;
  isLogged: boolean = false;

  TAFArray: FileData[] = [];
  isLoading: boolean = true;
  searchQuery: string = ''; // Variable to hold the search query

  currentDate: string | undefined;
  currentTime: string | undefined;
  intervalId: any;

  isKeyboardVisible = false;
  private mobileQuery: MediaQueryList;
  isMobile: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private iab: InAppBrowser,
    private spinner: NgxSpinnerService,
    private apiService: APIService,
    private dialog: MatDialog,
    private datePipe: DatePipe,

    private mediaMatcher: MediaMatcher,
    private platform: Platform
  ) {
    this.mobileQuery = this.mediaMatcher.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => (this.isMobile = this.mobileQuery.matches);
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
    this.isMobile = this.mobileQuery.matches;

    Keyboard.addListener('keyboardWillShow', () => {
      this.isKeyboardVisible = true;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      this.isKeyboardVisible = false;
    });
  }

  ngOnInit() {
    this.spinner.show();
    this.loading = true;

    // this.updateTime();
    // this.intervalId = setInterval(() => {
    //   this.updateTime();
    // }, 1000);
    this.mobileQuery = this.mediaMatcher.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => (this.isMobile = this.mobileQuery.matches);
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
    this.isMobile = this.mobileQuery.matches;

    Keyboard.addListener('keyboardWillShow', () => {
      this.isKeyboardVisible = true;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      this.isKeyboardVisible = false;
    });
    this.apiService.GetSourceTextFolderFilesTime('taffc', 6).subscribe(
      (Response: FileData[]) => {
        this.TAFArray = Response.slice(0, 20).map((item: FileData) => {
          const parts = item.filename.split('/');
          if (parts.length > 1) {
            const newFilename = parts.slice(1).join('/');
            return {
              ...item,
              filename: newFilename,
            };
          } else {
            return item;
          }
        });
        // this.searchQuery = this.searchQuery;
        this.loading = false;
        this.spinner.hide();
        // Handle response data

        this.updateTime(this.TAFArray[0]?.lastmodified);
      },
      (error) => {
        console.error('API Error:', error);
        this.loading = false; // Make sure to handle loading state in case of error
        this.spinner.hide(); // Ensure spinner is hidden on error
      }
    );
  }
  private mobileQueryListener: () => void;

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);

    Keyboard.removeAllListeners();
  }
  updateTime(date: string) {
    // const now = new Date();
    this.currentDate =
      this.datePipe.transform(date, 'yyyy - MM - dd') ?? '2024 - 01 - 22';
    this.currentTime = this.datePipe.transform(date, 'HH:mm:ss') ?? '13:15:45';
  }

  forecastPageNavigation() {
    this.router.navigate(['/forecast']);
  }
  // Method to handle search form submission
  onSearch(event: Event) {
    event.preventDefault(); // Prevent default form submission behavior
    this.searchQuery = this.searchQuery.trim().toLowerCase();
  }

  // Method to filter TAFArray based on search query
  get filteredTAFArray(): FileData[] {
    if (!this.searchQuery) {
      return this.TAFArray;
    }
    return this.TAFArray.filter((item) =>
      item.filecontent.toLowerCase().includes(this.searchQuery)
    );
  }

  extractHeadingContent(filecontent: string): string | null {
    // Use a regular expression to find the content starting with 'TAF'
    const regex = /TAF[\s\S]*?(?=TEMPO|$)/; // Matches from 'TAF' to 'TEMPO' or end of string

    const match = filecontent.match(regex);

    if (match) {
      return match[0]; // Return the matched content
    } else {
      return null; // Return null if no match found
    }
  }

  extractRemainingContent(filecontent: string): string {
    // Extract remaining content after the content used for <h1> (e.g., using regex or string manipulation)
    // Return the extracted content
    return filecontent.substring(filecontent.indexOf('TEMPO') + 5);
  }
  ImageViewer(item: any) {
    console.log('file Name:', item);
    const folderName = 'sigw';
    const fileName = item;
    this.isLoading = true;

    this.isLoading = false;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '80%';
    dialogConfig.height = '80%';
    dialogConfig.data = { item };

    const dialogRef = this.dialog.open(ViewDecodedPage, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      this.isLoading = false;
    });
  }

  ScrollToTop(value: any) {
    var element = document.getElementById(value);
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}
