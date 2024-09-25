import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-aero-sport',
  templateUrl: './aero-sport.page.html',
  styleUrls: ['./aero-sport.page.scss'],
})
export class AeroSportPage implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  get isFreeSubscription(): boolean {
    return this.authService.getIsFreeSubscription();
  }

  NavigateToCentralInterior() {
    this.router.navigate(['aero-sport/central-interior']);
  }

  NavigateToSouthWesternCape() {
    this.router.navigate(['aero-sport/south-west-cape']);
  }

  NavigateToSynopticAnalysis() {
    this.router.navigate(['aero-sport/synoptic-analysis']);
  }

  NavigateToKwazulNatal() {
    this.router.navigate(['aero-sport/kwazulu-natal']);
  }

  NavigateToSpotGraphMap() {
    this.router.navigate(['aero-sport/spot-graph-map']);
  }

  NavigateToTSProbability() {
    this.router.navigate(['aero-sport/tsprobability']);
  }

  NavigateToLandingPage() {
    this.router.navigate(['/landing-page']);
  }

  NavigateToCloudForecast() {
    this.router.navigate(['/aero-sport/cloud-fore-cast']);
  }
}
