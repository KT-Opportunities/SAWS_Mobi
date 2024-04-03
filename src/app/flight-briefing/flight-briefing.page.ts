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
  isDropdownOpen: boolean = false;
  selectedOption: string = 'Select flight';

 
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
  flightDropdown(dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.isDropdownOpen = !this.isDropdownOpen;
     
    }
  }

  selectOption(option: string, dropdown: string) {
    if (dropdown === 'dropdown') {
      this.selectedOption = option;
     
    } 
   
    
    // if (dropdown === 'dropdown4') {
    //   this.selectedOption4 = option;
    //   this.isDropdownOpen2 = false;
    // }
   
  }

  forecastPage() {
    this.router.navigate(['/landing-page']);
  }
}
