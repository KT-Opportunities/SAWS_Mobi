import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common'; 
import { AuthService } from 'src/app/services/auth.service';

export interface Metar {
  raw_text: string;
  color?: string;
}

@Component({
  selector: 'app-observation',
  templateUrl: './observation.page.html',
  styleUrls: ['./observation.page.scss'],
})

export class ObservationPage {

  constructor(
    private router: Router,
     private authService: AuthService, 
 ) {}

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  get isFreeSubscription(): boolean {
    return this.authService.getIsFreeSubscription();
  }

  NavigateToRadar() {
    this.router.navigate (['/observation/radar'])
  }

  NavigateToSatelite() {
    this.router.navigate (['/observation/satelite'])
  }

  NavigateToSpeci () {
    this.router.navigate (['/observation/speci'])
  }

  NavigateToWeatherMap () {
    this.router.navigate (['/observation/weather-map'])
  }

  NavigateToColorCoded () {
  this.router.navigate (['/observation/metar-color-coded'])
  }

  NavigateToMetar () {
    this.router.navigate (['/observation/metar'])
  }

  NavigateToMetarRecent(){
    this.router.navigate (['/observation/metar-history'])
  }

  NavigateToMetarHistory(){
    this.router.navigate (['/observation/metar-history'])
  }

  NavigateToMetarTafRecent() {
    this.router.navigate (['/observation/metar-taf-recent'])
  }

  NavigateToLandingPage() {
    this.router.navigate(['/landing-page']);
  }
  
  NavigateToWebCam() {
    this.router.navigate(['observation/web-cam']);
  }
 
}




