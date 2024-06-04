import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-flight-briefing',
  templateUrl: './flight-briefing.page.html',
  styleUrls: ['./flight-briefing.page.scss'],
})
export class FlightBriefingPage {
  isLogged: boolean = false;
 
  constructor(private router: Router, private authService: AuthService) {}

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

  NavigateToLandingPage()
  {
    this.router.navigate(['/landing-page']);
  }

}


