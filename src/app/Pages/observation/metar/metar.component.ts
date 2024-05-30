import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-metar',
  templateUrl: './metar.component.html',
  styleUrls: ['./metar.component.scss'],
})
export class MetarComponent  implements OnInit {

  isLogged: boolean = false;
  loading: boolean = false;

  metarReports: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: APIService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,

   ) { }

  ngOnInit() {
    this.fetchMetarReports();
  }

  observationPageNavigation() {
    this.router.navigate(['/observation']);
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

}
