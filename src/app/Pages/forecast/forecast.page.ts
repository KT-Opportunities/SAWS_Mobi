import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.page.html',
  styleUrls: ['./forecast.page.scss'],
})
export class ForecastPage {
  isLogged: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  get isFreeSubscription(): boolean {
    return this.authService.getIsFreeSubscription();
  }

  NavigateToLandingPage() {
    this.router.navigate(['/landing-page']);
  }

  NavigateToColorCodedTaf() {
    this.router.navigate(['/forecast/color-coded-taf']);
  }

  NavigateToColorcodedSigmetAirmet() {
    this.router.navigate(['/forecast/color-coded-sigment-airmet']);
  }

  NavigateToSigmetAirmet() {
    this.router.navigate(['/forecast/sigmet-airmet']);
  }

  NavigateToColorCodedWarnings() {
    this.router.navigate(['/forecast/color-coded-warnings']);
  }

  NaviagateToAdvisories() {
    this.router.navigate(['/forecast/advisories']);
  }

  NavigateToWarnings() {
    this.router.navigate(['/forecast/warnings']);
  }

  NavigateToTakeOffData() {
    this.router.navigate(['/forecast/take-off-data']);
  }

  NavigateToTafs() {
    this.router.navigate(['/forecast/taf']);
  }

  NavigateToRecentTAF() {
    this.router.navigate(['/forecast/recent-tafs']);
  }

  NavigateToTrends() {
    this.router.navigate(['/forecast/trends']);
  }

  NavigateToHarmonizedGridProducts() {
    this.router.navigate(['/forecast/waf-harminized-grid-products']);
  }

  NavigateToTafAccuracy() {
    this.router.navigate(['/forecast/taf-accuracy']);
  }
}
