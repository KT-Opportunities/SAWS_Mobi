import {
  Component,
  inject,
  OnInit,
  ElementRef,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ImageViewrPage } from '../Pages/image-viewr/image-viewr.page';
import { HttpClient } from '@angular/common/http';
interface ResponseItem {
  foldername: string;
  filename: string;
  lastmodified: string;
  filetextcontent: string;
  // Add other properties if needed
}
interface FileData {
  foldername: string;
  filename: string;
  lastmodified: string;
  filetextcontent: string;
}

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.page.html',
  styleUrls: ['./forecast.page.scss'],
})
export class ForecastPage implements OnInit {
  isLogged: boolean = false;
 
  recentTafs: any[] = [];
  speciReports: any[] = []; 
  isFormVisible: boolean = true;
  isform2Visible: boolean = true;
  iscodeTafs: boolean = false;
  isSigmentAirmet: boolean = false;
  isColorSigmentAirmet: boolean = false;
  iscolorCodedWarning: boolean = false;
  isWarning: boolean = false;
  isAdvesories: boolean = false;
  istakeOfData: boolean = false;
  isTAF: boolean = false;
  isRecentTAF: boolean = false;
  isTafAccuracy: boolean = false;
  isTrends: boolean = false;
  isHarmonized: boolean = false;
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  selectedOption1: string = 'select saved Template';
  selectedOption2: string = 'Last Hour';
  selectedOption3: string = '5 minutes';
  selectedAirportCode: string = 'FAPE';
  loading = false;
  isLoading: boolean = true;
  AirmetArray: any = [];
  SigmetArray: any = [];
  VermetArray: any = [];

  //TAFArray: any = [];

  TAFArray: FileData[] = [];
  vermetTableData: {
    airport: string;
    time: string;
    temp: string;
    qnh: string;
    qan: string;
  }[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private iab: InAppBrowser,
    private spinner: NgxSpinnerService,
    private APIService: APIService,
    private dialog: MatDialog
  ) {}
  onAirportCodeChange(event: any) {
    this.selectedAirportCode = event.target.value; // Update selectedAirportCode when select value changes
  }

  // Function to check if item should be displayed based on selectedAirportCode
  shouldDisplayItem(item: any): boolean {
    return this.selectedAirportCode === this.getAirportCode(item.filename);
  }

  getAirportCode(filename: string): string {
    // Extract airport code (CCCC) from filename
    const parts = filename.split('-');
    const airportCode = parts[0].slice(6, 10).toUpperCase();
    return airportCode;
  }
  // Inside ForecastPage class
  extractTakeOffData(filetextcontent: string): string {
    // Split the filetextcontent into lines
    const lines = filetextcontent.split('\n');

    // Find the line that contains "TAKE-OFF DATA"
    const takeOffLine = lines.find((line) => line.includes('TAKE-OFF DATA'));

    // Return the found line
    return takeOffLine || ''; // Return the line if found, otherwise an empty string
  }

  ngOnInit() {
    this.VermetArray.forEach((airportData: any) => {
      const time = airportData.filetextcontent
        .split('\n')[7]
        .substring(0, 4)
        .trim();
      const temp = airportData.filetextcontent
        .split('\n')[7]
        .substring(5, 8)
        .trim();
      const qnh = airportData.filetextcontent
        .split('\n')[7]
        .substring(13, 17)
        .trim();
      const qan = airportData.filetextcontent
        .split('\n')[7]
        .substring(20)
        .trim();

      this.vermetTableData.push({
        airport: airportData.foldername,
        time,
        temp,
        qnh,
        qan,
      });
    });
  }
  fetchRecentTafs(): void {
    this.loading = true; // Set loading to true when fetching starts
    this.spinner.show(); // Show the spinner
  
    const foldername = 'taffc'; // Specify the folder name
    this.APIService.getRecentTafs(foldername).subscribe(
      (data) => {
        // Assign fetched data to recentTafs array
        this.recentTafs = data;
        // Set loading to false when fetching is complete
        this.loading = false;
        // Hide the spinner
        this.spinner.hide();
      },
      (error) => {
        // Log error to console
        console.error('Error fetching recent TAFs:', error);
        // Set loading to false when an error occurs
        this.loading = false;
        // Hide the spinner
        this.spinner.hide();
      }
    );
  }
  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  toggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.closeAllDropdowns();
    }
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
      this.isDropdownOpen3 = false;
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
  closeAllDropdowns() {
    this.isDropdownOpen1 = false;
    this.isDropdownOpen2 = false;
  }
  LandingPage() {
    this.router.navigate(['/landing-page']);
  }
  forecastDropdown(dropdown: string) {
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
  ColorCoded() {
    // debugger;

    this.spinner.show();
    this.loading = true;
    this.APIService.GetSourceTextFolderFilesTime('taffc', 4).subscribe(
      (Response: FileData[]) => {
        this.TAFArray = Response.map((item: FileData) => {
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
        this.loading = false;
        this.spinner.hide();
        console.log('Response received:', Response);
        // Handle response data
      },
      (error) => {
        console.error('API Error:', error);
        this.loading = false; // Make sure to handle loading state in case of error
        this.spinner.hide(); // Ensure spinner is hidden on error
      }
    );

    this.iscodeTafs = true;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isColorSigmentAirmet = false;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
  }

  forecastPage() {
    this.iscodeTafs = false;
    this.isFormVisible = true;
    this.isSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isColorSigmentAirmet = false;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
    this.isform2Visible = true && this.isLoggedIn == false;
  }
  ColorcodedSigmetAirmet() {
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = true;
    this.isColorSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
    if (this.isLoggedIn == true) {
      this.spinner.show();
      this.router.navigate(['/sigmet-gamet']);
    }
  }
  SigmetAirmet() {
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.isColorSigmentAirmet = true;
    this.iscolorCodedWarning = false;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
    this.isform2Visible = false && this.isLoggedIn == false;
    debugger;
    if (this.isLoggedIn == true) {
      this.spinner.show();
      this.router.navigate(['/sigmet_airmet']);
    }
  }
  ColorcodedWarning() {
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.isColorSigmentAirmet = false;
    this.iscolorCodedWarning = true;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
  }
  Advesories() {
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.isColorSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isAdvesories = true;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
    debugger;

    if (this.isLoggedIn == true) {
      this.spinner.show();
      this.router.navigate(['/advisories']);
    }

    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
    this.isform2Visible = false && this.isLoggedIn == false;

    debugger;
    // this.spinner.show();
    // this.router.navigate(['/advisories']);
  }
  Warning() {
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.isColorSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isAdvesories = false;
    this.isWarning = true;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
  }
  TakeOfData() {
    this.loading = true;
    this.spinner.show();
    this.APIService.GetSourceTextFolderFiles('varmet').subscribe((Response) => {
      this.VermetArray = Response;

      // Step 1: Group items by airport code and keep only the latest modified item for each airport
      const airportMap = this.VermetArray.reduce(
        (acc: { [key: string]: ResponseItem }, item: ResponseItem) => {
          const airportCode = this.getAirportCode(item.filename);

          // If airportCode already exists in the map, compare lastmodified dates to keep the latest one
          if (
            !acc[airportCode] ||
            new Date(item.lastmodified) >
              new Date(acc[airportCode].lastmodified)
          ) {
            acc[airportCode] = item;
          }

          return acc;
        },
        {}
      );

      // Step 2: Convert the map values back to an array
      this.VermetArray = Object.values(airportMap);

      // Optional: Filter based on 'TAKE-OFF' condition
      this.VermetArray = this.VermetArray.filter((item: ResponseItem) => {
        return item.filetextcontent.includes('TAKE-OFF');
      });

      this.VermetArray.forEach((item: any) => {
        const tableData = item.filetextcontent.split('\n').slice(5, -1); // Extract rows excluding header and footer

        const formattedData = tableData.reduce((acc: any[], row: string) => {
          const trimmedRow = row.trim();

          // Check if the row is not empty and doesn't start with '----' (separator)
          if (trimmedRow && !trimmedRow.startsWith('----')) {
            // Split the row by whitespace
            const rowValues = trimmedRow.split(/\s+/);

            // Extract specific values (time, temp, qnh, qan)
            if (rowValues.length >= 4) {
              const [time, temp, qnh, qan] = rowValues;
              acc.push({ time, temp, qnh, qan });
            }
          }

          return acc;
        }, []);

        item.vermetTableData = formattedData; // Assign formattedData to a property
        // console.log('Filtered and latest Response Table ', formattedData);
        this.loading = false;
        this.spinner.hide();
      });
    });
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.isColorSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = true;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
  }
  TAF() {
    this.spinner.show();
    this.loading = true;
    this.APIService.GetSourceTextFolderFilesTime('taffc', 4).subscribe(
      (Response: FileData[]) => {
        this.TAFArray = Response.map((item: FileData) => {
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
        this.loading = false;
        this.spinner.hide();
        console.log('Response received:', Response);
        // Handle response data
      },
      (error) => {
        console.error('API Error:', error);
        this.loading = false; // Make sure to handle loading state in case of error
        this.spinner.hide(); // Ensure spinner is hidden on error
      }
    );

    // Reset other flags
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.isColorSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = true;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
    this.isform2Visible = false && this.isLoggedIn == false;
  }
  extractHeadingContent(fileTextContent: string): string | null {
    // Use a regular expression to find the content starting with 'TAF'
    const regex = /TAF[\s\S]*?(?=TEMPO|$)/; // Matches from 'TAF' to 'TEMPO' or end of string
  
    const match = fileTextContent.match(regex);
  
    if (match) {
      return match[0]; // Return the matched content
    } else {
      return null; // Return null if no match found
    }
  }

  extractRemainingContent(filetextcontent: string): string {
    // Extract remaining content after the content used for <h1> (e.g., using regex or string manipulation)
    // Return the extracted content
    return filetextcontent.substring(filetextcontent.indexOf('TEMPO') + 5);
  }
  extractFirstLine(filetextcontent: string): string {
    const lines = filetextcontent.split('\n');
    return lines[0] ? lines[0].trim() : '';
  }

  extractSecondLine(filetextcontent: string): string {
    const lines = filetextcontent.split('\n');
    return lines[1] ? lines[1].trim() : '';
  }

  extractThirdLine(filetextcontent: string): string {
    const lines = filetextcontent.split('\n');
    return lines[2] ? lines[2].trim() : '';
  }
  RecentTAF() {
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.isColorSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = true;
    this.isTafAccuracy = false;
    this.isTrends = false;
    this.isHarmonized = false;
    this.fetchRecentTafs()
    this.isform2Visible = false && this.isLoggedIn == false;
  }
  tafAccuracy() {
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.isColorSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = true;
    this.isTrends = false;
    this.isHarmonized = false;
  }
  Trends() {
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.isColorSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = true;
    this.isHarmonized = false;
  }

  harmonized() {
    this.iscodeTafs = false;
    this.isFormVisible = false;
    this.isSigmentAirmet = false;
    this.isColorSigmentAirmet = false;
    this.iscolorCodedWarning = false;
    this.isAdvesories = false;
    this.isWarning = false;
    this.istakeOfData = false;
    this.isTAF = false;
    this.isRecentTAF = false;
    this.isTafAccuracy = false;
    this.isTrends = false;

    if (this.isLoggedIn == true) {
      this.spinner.show();
      this.router.navigate(['/harmonized-grid']);
    }
  }
}
