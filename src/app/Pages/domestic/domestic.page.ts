import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-domestic',
  templateUrl: './domestic.page.html',
  styleUrls: ['./domestic.page.scss'],
})
export class DomesticPage {
  isLogged: boolean = false;
  loading: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  get isFreeSubscription(): boolean {
    return this.authService.getIsFreeSubscription();
  }
  NavigateToWarnings() {
    this.router.navigate(['domestic/warnings']);
  }

  NavigateToFlightDocument() {
    this.router.navigate(['domestic/flight-document']);
  }

  NavigateToWindsCharts() {
    this.router.navigate(['domestic/winds-charts']);
  }

  NavigateToIcaoLocations() {
    this.router.navigate(['domestic/icao-locations']);
  }

  NavigateToTakeOffData() {
    this.router.navigate(['domestic/take-off-data']);
  }

  NavigateToLowLevelWindProfile() {
    this.router.navigate(['domestic/low-level-wind-profile']);
  }

  NavigateToTakeOff() {
    this.router.navigate(['domestic/take-off-data']);
  }
  NavigateToSIGWXCharts() {
    this.router.navigate(['domestic/sigwx-charts']);
  }

  NavigateToMetarMaps() {
    this.router.navigate(['domestic/metar-maps']);
  }

  NavigateToQnhChart() {
    this.router.navigate(['domestic/qnh-chart']);
  }

  NavigateToHourlyCharts() {
    this.router.navigate(['domestic/hourly-charts']);
  }

  NavigateToLandingPage() {
    this.router.navigate(['/landing-page']);
  }
}
