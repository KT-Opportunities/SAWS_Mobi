import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-metar-taf-recent',
  templateUrl: './metar-taf-recent.component.html',
  styleUrls: ['./metar-taf-recent.component.scss'],
})
export class MetarTafRecentComponent  implements OnInit {

  isLogged: boolean = false;
  loading: boolean = false;

  recentTafs: any[] = [];

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

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: APIService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService

   ) { }

  ngOnInit() {}

  observationPageNavigation() {
    this.router.navigate(['/observation']);
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
}
