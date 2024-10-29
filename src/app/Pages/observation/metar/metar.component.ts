import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ViewDecodedPage } from '../../view-decoded/view-decoded.page';

export interface Metar {
  raw_text: string;
  color?: string;
}

@Component({
  selector: 'app-metar',
  templateUrl: './metar.component.html',
  // styleUrls: ['./metar.component.scss'],
  styleUrls: ['./metar.component.scss'],
})
export class MetarComponent implements OnInit {
  isLogged: boolean = false;
  loading: boolean = false;
  metarReports: any[] = [];
  metarData: Metar[] = [];
  searchQuery: string = '';

  currentDate: string | undefined;
  currentTime: string | undefined;
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

  NavigateToObservation() {
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

  // Method to handle search form submission
  onSearch(event: Event) {
    event.preventDefault(); // Prevent default form submission behavior
    this.searchQuery = this.searchQuery.trim().toLowerCase();
  }

  // Method to filter TAFArray based on search query
  get filteredmetarReports(): any {
    if (!this.searchQuery) {
      return this.metarReports;
    }
    return this.metarReports.filter((item) =>
      item.filecontent.toLowerCase().includes(this.searchQuery)
    );
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
