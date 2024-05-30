import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-speci',
  templateUrl: './speci.component.html',
  styleUrls: ['./speci.component.scss'],
  providers: [DatePipe]
})
export class SpeciComponent  implements OnInit {

  isLogged: boolean = false;
  loading: boolean = false;
  currentDate: string;
  speciReportData: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: APIService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,

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
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') ?? '';

    // const now = new Date();
    // this.currentDate = this.datePipe.transform(now, 'shortDate') || '';
   }

  ngOnInit() {
    this.fetchSpeciReport();
  }

  observationPageNavigation() {
    this.router.navigate(['/observation']);
  }

  getCurrentDateTime(): string {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10); // Format: YYYY-MM-DD
    const formattedTime = currentDate.toTimeString().slice(0, 8); // Format: HH:MM:SS
    return formattedDate + ' ' + formattedTime;
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
  

}
