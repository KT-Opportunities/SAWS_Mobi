import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-domestic',
  templateUrl: './domestic.page.html',
  styleUrls: ['./domestic.page.scss'],
})
export class DomesticPage implements OnInit {
  isDomestic: boolean = true;
  isLogged: boolean = false;
  isHourlyCharts: boolean = false;
  isLowLevel:Boolean = false;

  isTakeOff: boolean = false;
  isDropdownOpen5: boolean = false;
  selectedOption5: string = 'CCCC';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
     // Check if user is logged in
     if (!this.authService.getIsLoggedIn()) {
      // If not logged in, navigate to the login page
      this.router.navigate(['/login']);
    }

  }
  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  DomeDomestic(){

  }

  takeoff(){
    this.isDomestic = false;
    this.isTakeOff = true;
  }
  lowlevel(){
    this.isDomestic= false;
    this.isLowLevel = true;
  }

  hourlyChart() {
    this.isDomestic = false;
    this.isHourlyCharts = true
  }
  DomesticBack() {
    this.isDomestic = true;
    this.isHourlyCharts = false;
    this.isLowLevel = false;
    this.isTakeOff = false; 
  }
  
  domesticPage() {
    
    this.router.navigate(['/landing-page']);
  }
  toggleDropdown(dropdown: string) {
    if (dropdown === 'dropdown5') {
      this.isDropdownOpen5 = !this.isDropdownOpen5;
    }
  }
  
  selectOption(option: string) {
    this.selectedOption5 = option;
    this.isDropdownOpen5 = false;
  }
}
