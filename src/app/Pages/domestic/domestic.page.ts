import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';

interface ResponseItem {
  foldername: string;
  filename: string;
  lastmodified: string;
  filetextcontent: string;
  // Add other properties if needed
}

@Component({
  selector: 'app-domestic',
  templateUrl: './domestic.page.html',
  styleUrls: ['./domestic.page.scss'],
})
export class DomesticPage implements OnInit {
  isDomestic: boolean = true;
  isLogged: boolean = false;
  isHourlyCharts: boolean = false;
  isLowLevel: Boolean = false;
  isWindCharts: boolean = false;
  isTakeOff: boolean = false;
  isWarning: boolean = false;
  isDropdownOpen5: boolean = false;
  isDropdownOpen6: boolean = false;
  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  isDropdownOpen4: boolean = false;
  isSIGWX: boolean = false;
  isLocation: boolean = false;
  isFlightDocument: boolean = false;

  selectedOption2: string = 'XXX';
  selectedOption3: string = 'XXX';
  selectedOption4: string = 'XXX';
  selectedOption5: string = 'CCCC';
  selectedOption6: string = 'Stations';

  showImage: boolean = false;
  showImage1: boolean = false;
  loading = false;
  selectedAirportCode: string = 'FAPE';
  warnings: any[] = [];
  VermetArray: any = [];
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
    private spinner: NgxSpinnerService,
    private APIService: APIService,
    private iab: InAppBrowser
  ) {}

  ngOnInit() {
    // Check if user is logged in
    if (!this.authService.getIsLoggedIn()) {
      // If not logged in, navigate to the login page
      this.router.navigate(['/login']);
    }
  }

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

  fetchWarnings() {
    // Set loading to true when starting data fetch
    // this.loading = true;

    // Display the loading indicator
    this.spinner.show();

    this.APIService.GetSourceTextFolderFiles('unknown').subscribe(
      (data: any[]) => {
        console.log('Received warnings:', data);
        this.warnings = data;
        // Set isWarning to true after data is loaded
        this.isDomestic = false;
        this.isWarning = true;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching warnings:', error);
        // Hide the loading indicator in case of error
        this.spinner.hide();
      },
      () => {
        // Hide the loading indicator when data is successfully loaded or in case of error
        this.loading = false;
        this.spinner.hide();
      }
    );
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  NavigateToWarnings() {
    this.router.navigate(['domestic/warnings']);
  }

  NavigateToFlightDocument() {
    this.router.navigate(['domestic/flight-document']);
  }

  NavigateToWindsCharts() {
    this.router.navigate(['domestic/winds-charts']);
  }

  NavigateToIcaoLocations() {
    this.router.navigate(['domestic/icao-locations']);
  }

  NavigateToTakeOffData() {
    this.router.navigate(['domestic/take-off-data']);
  }

  NavigateToLowLevelWindProfile() {
    this.router.navigate(['domestic/low-level-wind-profile']);
  }

  NavigateToSIGWXCharts() {
    this.router.navigate(['domestic/sigwx-charts']);
  }
  
  NavigateToMetarMaps() {
    this.router.navigate(['domestic/metar-maps']);
  }

  NavigateToQnhChart() {
    this.router.navigate(['domestic/qnh-chart']);
  }

  NavigateToHourlyCharts() {
    this.router.navigate(['domestic/hourly-charts']);
  }

  DomesticBack() {
    this.isDomestic = true;
    this.isHourlyCharts = false;
    this.isLowLevel = false;
    this.isTakeOff = false;
    this.isWindCharts = false;
    this.isWarning = false;
    this.isSIGWX = false;
    this.isFlightDocument = false;
    this.isLocation = false;
    this.showImage = false;
    this.showImage1 = false;
  }

  domesticPage() {
    this.router.navigate(['/landing-page']);
  }

  toggleImageVisibility() {
    this.isDomestic = false;
    this.showImage = !this.showImage;
  }

  toggleImageVisibility1() {
    this.isDomestic = false;
    this.showImage1 = !this.showImage1;
  }

  toggleDropdown(dropdown: string) {
    if (dropdown === 'dropdown5') {
      this.isDropdownOpen5 = !this.isDropdownOpen5;
      this.isDropdownOpen6 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen2 = false;
    }
    if (dropdown === 'dropdown2') {
      this.isDropdownOpen2 = !this.isDropdownOpen2;
      this.isDropdownOpen6 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen5 = false;
    }
    if (dropdown === 'dropdown3') {
      this.isDropdownOpen3 = !this.isDropdownOpen3;
      this.isDropdownOpen6 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen5 = false;
    }
    if (dropdown === 'dropdown4') {
      this.isDropdownOpen4 = !this.isDropdownOpen4;
      this.isDropdownOpen6 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen5 = false;
    }
    if (dropdown === 'dropdown6') {
      this.isDropdownOpen6 = !this.isDropdownOpen6;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen5 = false;
    }
  }

  selectOption(option: string) {
    this.selectedOption5 = option;
    this.isDropdownOpen5 = false;
  }

  NavigateToLandingPage() {
    this.router.navigate(['/landing-page']);
  }
}
