import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-flight-briefing',
  templateUrl: './flight-briefing.page.html',
  styleUrls: ['./flight-briefing.page.scss'],
})
export class FlightBriefingPage implements OnInit {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['Flight','departure', 
  'destination','etd','vfr','edit'];
  

  isLogged: boolean = false;
  isFlight: boolean = true;
  isexportImport: boolean = false;
  isdeparture: boolean = false;
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  isSharedflight: boolean = false;
  isEditFlight: boolean = false;
  isSavedFlight : boolean = false;
  isSheduleFlight : boolean = false;
  isSavedTemplate: boolean = false; 
  selectedOption1: string = 'Select flight';
  selectedOption2: string = 'Select template';
// displayedColumns: any;

 
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  NavigateToImportExport() {
    this.router.navigate(['/flight-briefing/import-export']);
  }

  NavigateToImportDepartureList() {
    this.router.navigate(['/flight-briefing/import-departure-list']);
  }

  NavigateToFlightShare() {
    this.router.navigate(['/flight-briefing/flight-share']);
  }

  NavigateToFlightEdit() {
    this.router.navigate(['/flight-briefing/flight-edit']);
  }

  NavigateToFlightSave() {
    this.router.navigate(['/flight-briefing/flight-save']);
  }

  NavigateToSheduleFlightReport () {
    this.router.navigate(['/flight-briefing/schedule-flight-report']);
  }

  

  forecastPage() {
    this.router.navigate(['/landing-page']);
  }

  flieghtBrief() {
    this.isFlight = true;
   this.isexportImport = false;
  this.isdeparture = false;
  this.isDropdownOpen1 = false;
  this.isSharedflight = false;
  this.isEditFlight = false;
  this.isSavedFlight = false;
  this.isSharedflight = false;
  this.isSheduleFlight = false;
  }

  selectOption(option: string, dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.selectedOption1 = option;
     
    } 
    if (dropdown === 'dropdown2') {
      this.selectedOption2 = option;
     
    }
   
  }

  selectDropdown(dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.isDropdownOpen1 = !this.isDropdownOpen1;
    }
    if (dropdown === 'dropdown2') {
      this.isDropdownOpen2 = !this.isDropdownOpen2;
    }
    
   
}
  closeAllDropdowns() {
    this.isDropdownOpen1 = false;
    this.isDropdownOpen2 = false;
 
  }

  NavigateToLandingPage()
  {
    this.router.navigate(['/landing-page']);
  }

}


