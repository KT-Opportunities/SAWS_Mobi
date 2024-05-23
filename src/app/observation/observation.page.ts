import { Component, OnInit,ElementRef,
  HostListener, } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { APIService } from 'src/app/services/apis.service';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common'; 



// interface SpeciReport {
//   date: string;
//   time: string;
//   content: string;
// }
export interface Metar {
  raw_text: string;
  color?: string;
}

@Component({
  selector: 'app-observation',
  templateUrl: './observation.page.html',
  styleUrls: ['./observation.page.scss'],
})

export class ObservationPage implements OnInit {
  
  metarData: Metar[] = [];
  speciReportData: any[] = [];
  loading = false;
  metarReports: any[] = [];
  currentDate: string;
  speciReports: any[] = []; 
  recentTafs: any[] = [];
  isLogged: boolean = false;
  isMetar:boolean = true;
  isRanderImages:boolean = false;
  isObservMeter: boolean = false;
  iscodeTafs:boolean = false;
  issatelite:boolean = false;
  isSpeci:boolean =false
  isRecentMetar:boolean = false;
  isRecentTafs:boolean = false;
  isMetarHistory: boolean = false;
  isWeatherMap:boolean = false;
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  isDropdownOpen4: boolean = false;
  isDropdownOpen5: boolean = false;
  isDropdownOpen6: boolean = false;
  isDropdownOpen7: boolean = false;
  isDropdownOpen8: boolean = false;
  isDropdownOpen11: boolean = false;
  isDropdownOpen: boolean = false;
  selectedOption1: string = 'Animation Type';
  selectedOption2: string = '2024-03-20 13:15';
  selectedOption3: string = 'FAVV';
  selectedOption11: string = 'Select Plot meteogram';
  selectedOption5: string = 'Select saved Template';
  selectedOption6: string = 'Last Hour';
  selectedOption7: string = '5 Min';
  selectedOption8: string = '2024-03-20 13:15';
  webcamActive: boolean = false;
  // metarReports: any;

  
  constructor(
    private router: Router,
     private authService: AuthService, 
     private apiService: APIService,
     private elRef: ElementRef,
     private spinner: NgxSpinnerService,
     private datePipe: DatePipe
    
    
 ) {
  this.speciReportData = [
    {
      date: '2024-05-14',
      time: '13:15:45',
      content: 'SPECI report content goes here with PROB30 TSRA CB keywords.',
    },
    // Add more sample SPECI reports as needed
  ];
  // Format current date using DatePipe
  this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || ''; // 'yyyy-MM-dd' is the desired format
}
getCurrentDateTime(): string {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 10); // Format: YYYY-MM-DD
  const formattedTime = currentDate.toTimeString().slice(0, 8); // Format: HH:MM:SS
  return formattedDate + ' ' + formattedTime;
}

 highlightKeywords(content: string): string {
  // Define your keywords and corresponding CSS classes
  const keywords = ['PROB30', 'TSRA', 'CB'];
  const cssClass = 'highlight'; // Define your CSS class for highlighting

  // Replace each keyword with a span element having the highlight CSS class
  keywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'g');
    content = content.replace(regex, `<span class="${cssClass}">${keyword}</span>`);
  });

  return content;
}
ngOnInit(): void {
  // Example foldername and time, adjust these values as needed
  
}
  




  
  fetchMetarReports(): void {
    this.loading = true; // Set loading to true before fetching data
    this.spinner.show(); // Show spinner while fetching data

    const foldername = 'metar';
    this.apiService.getRecentTafs(foldername).subscribe(
      (data) => {
        console.log('Metar reports fetched successfully:', data);
        this.metarReports = data;
        this.loading = false; // Set loading to false after data is fetched
        this.spinner.hide(); // Hide spinner after data is fetched
      },
      (error) => {
        console.error('Error fetching Metar Reports:', error);
        this.loading = false; // Set loading to false in case of error
        this.spinner.hide(); // Hide spinner in case of error
      }
    );
  }
  
  // fetchMetarReports(): void {
  //   console.log('Fetching Metar reports...');
  //   this.spinner.show(); // Show spinner while fetching data
  //   const foldername = 'metar';
  //   this.apiService.getRecentTafs(foldername).subscribe(
  //     (data) => {
  //       console.log('Metar reports fetched successfully:', data);
  //       this.metarReports = data; // Assign fetched data to metarReports array
  //       this.spinner.hide(); // Hide spinner after data is fetched
  //     },
  //     (error) => {
  //       console.error('Error fetching Metar Reports:', error);
  //       this.spinner.hide(); // Hide spinner if there's an error
  //     }
  //   );
  // }
  fetchRecentTafs(): void {
    this.loading = true; // Set loading to true when fetching starts
    this.spinner.show(); // Show the spinner
  
    const foldername = 'taffc'; // Specify the folder name
    this.apiService.getRecentTafs(foldername).subscribe(
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
  

 fetchSpeciReport() {
  // Show loading indicator before making the API call
  this.loading = true;
  this.spinner.show();

  this.apiService.getSpeciReport().subscribe(
    (data) => {
      console.log('Speci report data:', data);
      this.speciReportData = data;
      // Hide loading indicator after fetching data
      this.loading = false;
      this.spinner.hide();
    },
    (error) => {
      console.error('Error fetching speci report:', error);
      // Hide loading indicator in case of error
      this.loading = false;
      this.spinner.hide();
    }
  );
}
// fetchMetarReports(): void {
//   console.log('Fetching Metar reports...');
//   this.loading = true;
//   this.spinner.show();
//   const foldername = 'metar';
//   this.apiService.getRecentTafs(foldername).subscribe(
//     (data) => {
//       console.log('Metar reports fetched successfully:', data);
//       this.metarReports = data;
//       this.loading = false;
//       this.spinner.hide();
//     },
//     (error) => {
//       console.error('Error fetching Metar Reports:', error);
//       this.loading = false;
//       this.spinner.hide();
//     }
//   );
// }
  
  
  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  metar () {
    this.isMetar = false;
    this.isRanderImages = true
  }
  satelite() {
    this.isMetar= false;
    // this.issatelite = true
    this.router.navigate (['/observation/satelite'])
  }
  speci () {
    this.isMetar = false;
    this.isSpeci = true;
    this.fetchSpeciReport();
  }
  weathermap () {
    this.isMetar = false;
    this.isWeatherMap = true
  }
  recentmeter(){
    
  }

  observatPage() {
    this.isMetar = true;
    this.isRanderImages = false;
    this.iscodeTafs = false;
    this.isObservMeter =false;
    this.issatelite= false;
    this.isSpeci = false;
    this.isMetarHistory = false;
    this.isRecentMetar = false;
    this.isRecentTafs= false;
    this.isWeatherMap = false;
  }

  colorcoded () {
  this.isMetar = false;
  this.iscodeTafs = true
  this.fetchMetarReports();
  }
  ObservMeter () {
    this.isMetar = false;
    this.isObservMeter = true
    this.fetchMetarReports();
    this.router.navigate (['/observation'])
  }

  MetarHistory() {
  this.isMetar = false;
  this.isMetarHistory = true;

  }

  RecentMetar(){
    this.isMetar = false;
    this.isRecentMetar = true
    this.fetchRecentTafs()
  }
  RecentTafs() {
    this.isMetar = false;
    this.isRecentTafs = true;
  }

  toggleDropdown(dropdown: string) {
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
      
    
    }
    
    if (dropdown === 'dropdown3') {
      this.isDropdownOpen3 = !this.isDropdownOpen3;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen4 = false;
    
    }
    if (dropdown === 'dropdown4') {
      this.isDropdownOpen4 = !this.isDropdownOpen4;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen3 = false;
    
    }
    if (dropdown === 'dropdown5') {
      this.isDropdownOpen5 = !this.isDropdownOpen5;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen11 = false;
    
    }
    if (dropdown === 'dropdown6') {
      this.isDropdownOpen6 = !this.isDropdownOpen6;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen5 = false;
    
    }
    if (dropdown === 'dropdown7') {
      this.isDropdownOpen7 = !this.isDropdownOpen7;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen5 = false;
      this.isDropdownOpen6 = false;
    }
    // if (dropdown === 'dropdown') {
    //   this.isDropdownOpen11 = !this.isDropdownOpen11;
    //   this.isDropdownOpen1 = false;
    //   this.isDropdownOpen2 = false;
    //   this.isDropdownOpen3 = false;
    //   this.isDropdownOpen4 = false;
    //   this.isDropdownOpen5 = false;
    
    // }
    if (dropdown === 'dropdown11') {
      this.isDropdownOpen11 = !this.isDropdownOpen11;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen5 = false;
    
    }
   
  }
  selectOption(option: string, dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.selectedOption1 = option;
      this.isDropdownOpen1 = false;
    } 
    if (dropdown === 'dropdown2') {
      this.selectedOption2 = option;
      this.isDropdownOpen2 = false;
    }
    if (dropdown === 'dropdown3') {
      this.selectedOption3 = option;
      this.isDropdownOpen2 = false;
    }
    if (dropdown === 'dropdown11') {
      this.selectedOption11 = option;
      this.isDropdownOpen5 = false;
    }
    
  }
  

  sateliteDropdown(dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.isDropdownOpen1 = !this.isDropdownOpen1;
      this.isDropdownOpen2 = false;
    }

    if (dropdown === 'dropdown2') {
      this.isDropdownOpen2 = !this.isDropdownOpen2;
      this.isDropdownOpen1 = false;
    }
  }

  selectDropdown(dropdown: string) {
    if (dropdown === 'dropdown5') {
      this.isDropdownOpen5 = !this.isDropdownOpen5;
      this.isDropdownOpen6 = false;
      this.isDropdownOpen7 = false;
      this.isDropdownOpen11 = false;
    
    }
    if (dropdown === 'dropdown6') {
      this.isDropdownOpen6 = !this.isDropdownOpen6;
      this.isDropdownOpen5 = false;
      this.isDropdownOpen7 = false;
    
    }
    if (dropdown === 'dropdown7') {
      this.isDropdownOpen7 = !this.isDropdownOpen7;
      this.isDropdownOpen6 = false;
      this.isDropdownOpen5 = false;
    
    }
    if (dropdown === 'dropdown11') {
      this.isDropdownOpen11 = !this.isDropdownOpen11;
      this.isDropdownOpen5 = false;
    }
}
  closeAllDropdowns() {
    this.isDropdownOpen1 = false;
    this.isDropdownOpen2 = false;
  }

  


  observPage() {
    this.router.navigate(['/landing-page']);
  }
  observMetarPage() {
    // this.router.navigate(['/news']);
    this.router.navigate(['/web-cam']);
  }
 
}




