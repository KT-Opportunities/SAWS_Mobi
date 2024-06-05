import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

interface ResponseItem {
  foldername: string;
  filename: string;
  lastmodified: string;
  filetextcontent: string;
  // Add other properties if needed
}

@Component({
  selector: 'app-take-off-data',
  templateUrl: './take-off-data.component.html',
  // styleUrls: ['./take-off-data.component.scss'],
  styleUrls: ['./../domestic.page.scss'],
})
export class TakeOffDataComponent  implements OnInit {

  isLogged: boolean = false;
  isLoading: boolean = false;
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
    private elRef: ElementRef,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private APIService: APIService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.loadTakeoffData();
    }
  }

  loadTakeoffData() {
    this.isLoading = true;
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
        this.isLoading = false;

        this.spinner.hide();
      });
    });
  }

  onAirportCodeChange(event: any) {
    this.selectedAirportCode = event.target.value; // Update selectedAirportCode when select value changes
  }

  getAirportCode(filename: string): string {
    // Extract airport code (CCCC) from filename
    const parts = filename.split('-');
    const airportCode = parts[0].slice(6, 10).toUpperCase();
    return airportCode;
  }

    // Function to check if item should be displayed based on selectedAirportCode
    shouldDisplayItem(item: any): boolean {
      return this.selectedAirportCode === this.getAirportCode(item.filename);
    }

  // get isLoggedIn(): boolean {
  //   return this.authService.getIsLoggedIn();
  // }

  NavigateToDomestic() {
    this.router.navigate(['/domestic']);
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

}
