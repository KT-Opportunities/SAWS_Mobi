import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ViewDecodedPage } from '../../view-decoded/view-decoded.page';

@Component({
  selector: 'app-recent-tafs',
  templateUrl: './recent-tafs.component.html',
  styleUrls: ['./../forecast.page.scss'],
})
export class RecentTafsComponent implements OnInit {
  loading = false;
  isLogged: boolean = false;
  isLoading: boolean = true;
  recentTafs: any[] = [];

  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  selectedOption1: string = 'select saved Template';
  selectedOption2: string = 'Last Hour';
  selectedOption3: string = '5 minutes';

  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private iab: InAppBrowser,
    private spinner: NgxSpinnerService,
    private apiService: APIService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchRecentTafs();
  }

  forecastPageNavigation() {
    this.router.navigate(['/forecast']);
  }

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

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  forecastDropdown(dropdown: string) {
    switch (dropdown) {
      case 'dropdown1':
        this.isDropdownOpen1 = !this.isDropdownOpen1;
        this.isDropdownOpen2 = false;
        this.isDropdownOpen3 = false;
        break;
      case 'dropdown2':
        this.isDropdownOpen2 = !this.isDropdownOpen2;
        this.isDropdownOpen1 = false;
        this.isDropdownOpen3 = false;
        break;
      case 'dropdown3':
        this.isDropdownOpen3 = !this.isDropdownOpen3;
        this.isDropdownOpen1 = false;
        this.isDropdownOpen2 = false;
        break;
    }
    this.cdRef.detectChanges(); // Ensure change detection
  }

  selectOption(option: string, dropdown: string, event: MouseEvent) {
    event.stopPropagation(); // Prevent event bubbling
    switch (dropdown) {
      case 'dropdown1':
        this.selectedOption1 = option;
        this.isDropdownOpen1 = false;
        break;
      case 'dropdown2':
        this.selectedOption2 = option;
        this.isDropdownOpen2 = false;
        break;
      case 'dropdown3':
        this.selectedOption3 = option;
        this.isDropdownOpen3 = false;
        break;
    }
    this.cdRef.detectChanges(); // Ensure change detection
  }

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
