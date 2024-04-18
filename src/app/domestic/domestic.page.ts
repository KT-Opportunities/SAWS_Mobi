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
  isWindCharts: boolean = false;
  isTakeOff: boolean = false;
  isWarning: boolean = false;
  isDropdownOpen5: boolean = false;
  isDropdownOpen6: boolean = false;
  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  isDropdownOpen4: boolean = false;
  isSIGWX: boolean = false;
  isLocation: boolean = false;
  isFlightDocument: boolean = false;
    
  selectedOption2: string = 'XXX';
  selectedOption3: string = 'XXX';
  selectedOption4: string = 'XXX';
  selectedOption5: string = 'CCCC';
  selectedOption6: string = 'Stations';
  
  showImage: boolean = false;
  showImage1: boolean = false;

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
  Warning() {
    this.isDomestic = false;
    this.isWarning = true;
  }
  FlightDocument(){
    this.isDomestic = false;
    this.isFlightDocument = true;
  }

  WindCharts(){
    this.isDomestic = false;
    this.isWindCharts = true;
  }
  location() {
  this.isDomestic = false;
  this.isLocation = true;
  }

  takeoff(){
    this.isDomestic = false;
    this.isTakeOff = true;
  }
  lowlevel(){
    this.isDomestic= false;
    this.isLowLevel = true;
  }
  SIGWX() {
    this.isDomestic = false;
    this.isSIGWX = true;
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
    this.isWindCharts = false;
    this.isWarning = false;
    this.isSIGWX = false;
    this.isFlightDocument = false;
    this.isLocation = false;
    this.showImage = false;
    this.showImage1 = false;
  }
  
  domesticPage() {
    
    this.router.navigate(['/landing-page']);
  }
  toggleImageVisibility() {
    this.isDomestic = false;
    this.showImage = !this.showImage;
  }

  toggleImageVisibility1() {
    this.isDomestic = false;
    this.showImage1 = !this.showImage1;
  }
  toggleDropdown(dropdown: string) {
    if (dropdown === 'dropdown5') {
      this.isDropdownOpen5 = !this.isDropdownOpen5;
      this.isDropdownOpen6 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen2 = false;
    }
    if (dropdown === 'dropdown2') {
      this.isDropdownOpen2 = !this.isDropdownOpen2;
      this.isDropdownOpen6 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen5 = false;
    }
    if (dropdown === 'dropdown3') {
      this.isDropdownOpen3 = !this.isDropdownOpen3;
      this.isDropdownOpen6 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen5 = false;
      
    }
    if (dropdown === 'dropdown4') {
      this.isDropdownOpen4 = !this.isDropdownOpen4;
      this.isDropdownOpen6 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen5 = false;
      
    }
    if (dropdown === 'dropdown6') {
      this.isDropdownOpen6 = !this.isDropdownOpen6;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen5 = false;
    }
  }
  
  selectOption(option: string) {
    this.selectedOption5 = option;
    this.isDropdownOpen5 = false;
  }

}
