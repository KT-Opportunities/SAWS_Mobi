import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { APIService } from 'src/app/services/apis.service';
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
    private APIService: APIService
  ) {
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

      console.log('Filtered and latest Response ', this.VermetArray);

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
        console.log('Filtered and latest Response Table ', formattedData);
        this.loading = false;
      });
    });
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
  ngOnInit() {
    // Check if user is logged in
    if (!this.authService.getIsLoggedIn()) {
      // If not logged in, navigate to the login page
      this.router.navigate(['/login']);
    }
  }
  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  DomeDomestic() {}
  Warning() {
    this.isDomestic = false;
    this.isWarning = true;
  }
  FlightDocument() {
    this.isDomestic = false;
    this.isFlightDocument = true;
  }

  WindCharts() {
    this.isDomestic = false;
    this.isWindCharts = true;
  }
  location() {
    this.isDomestic = false;
    this.isLocation = true;
  }

  takeoff() {
    this.loading = true;
    this.isDomestic = false;
    this.isTakeOff = true;
  }
  lowlevel() {
    this.isDomestic = false;
    this.isLowLevel = true;
  }
  SIGWX() {
    this.isDomestic = false;
    this.isSIGWX = true;
  }

  hourlyChart() {
    this.isDomestic = false;
    this.isHourlyCharts = true;
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
}
