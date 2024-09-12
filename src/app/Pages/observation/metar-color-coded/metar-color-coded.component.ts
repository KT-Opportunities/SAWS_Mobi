import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ViewDecodedPage } from '../../view-decoded/view-decoded.page';

// Define an interface to strongly type the MetarReport
interface MetarReport {
  filecontent: string;
  // Add other properties of the MetarReport object here
}

@Component({
  selector: 'app-metar-color-coded',
  templateUrl: './metar-color-coded.component.html',
  styleUrls: ['./metar-color-coded.component.scss'],
})
export class MetarColorCodedComponent implements OnInit {
  isLogged: boolean = false;
  loading: boolean = false;
  metarReports: MetarReport[] = [];
  filteredReports: MetarReport[] = [];
  searchQuery: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: APIService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fetchMetarReports();
  }

  navigateToObservation(): void {
    this.router.navigate(['/observation']);
  }

  fetchMetarReports(): void {
    this.loading = true; // Set loading to true before fetching data
    this.spinner.show(); // Show spinner while fetching data

    const foldername = 'metar';
    this.apiService.getRecentTafs(foldername).subscribe(
      (data: MetarReport[]) => {
        console.log('Metar reports fetched successfully:', data);
        this.metarReports = data;
        this.filteredReports = data; // Initialize filteredReports with all reports
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

  // Function to filter the reports based on the search query
  onSearch(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredReports = this.metarReports; // If search query is empty, show all reports
    } else {
      this.filteredReports = this.metarReports.filter((report) =>
        report.filecontent.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }
  isLoading: boolean = true;
  item: any;
  ImageViewer(item: any) {
    console.log('file Name:', item);
    const folderName = 'sigw';
    const fileName = item;
    console.log('Folder Name:', folderName);
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
}
