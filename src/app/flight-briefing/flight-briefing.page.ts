import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-flight-briefing',
  templateUrl: './flight-briefing.page.html',
  styleUrls: ['./flight-briefing.page.scss'],
})
export class FlightBriefingPage implements OnInit {
  isLogged: boolean = false;
  isFlight: boolean = true;
  isexportImport: boolean = false;
  isdeparture: boolean = false;
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  isSharedflight: boolean = false;
  isEditFlight: boolean = false;
  isSavedTemplate: boolean = false; 
  selectedOption1: string = 'Select flight';
  selectedOption2: string = 'Select templatet';

 
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}
  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  importExport() {
    this.isFlight = false;
    this.isexportImport = true;
  }
  departure() {
    this.isFlight = false;
    this.isdeparture = true;
  }
  shareflieght() {
    this.isFlight = false;
    this.isSharedflight = true;
  }
  EditFlight() {
    this.isFlight = false;
    this.isEditFlight = true;
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

}


