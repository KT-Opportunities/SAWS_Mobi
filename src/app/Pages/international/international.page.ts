import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ImageViewrPage } from '../image-viewr/image-viewr.page';
@Component({
  selector: 'app-international',
  templateUrl: './international.page.html',
  styleUrls: ['./international.page.scss'],
})
export class InternationalPage {
  isLogged: boolean = false;

  constructor(
      private router: Router,
      private authService: AuthService,
      private elRef: ElementRef,
      private APIService: APIService,
      private dialog: MatDialog
    ) {}
  
  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  get isFreeSubscription(): boolean {
    return this.authService.getIsFreeSubscription();
  }

  NavigateToLandingPage()
  {
    this.router.navigate(['/landing-page']);
  }

  NavigateToGPM() {
    this.router.navigate (['/international/gpm'])
  }

  NavigateToHumidity() {
    this.router.navigate(['/international/humidity']);
  }

  NavigateToImageBrowser() {
    this.router.navigate (['/international/image-browser'])
  }

  NavigateToGridWinds() {
    this.router.navigate(['/international/grid-winds']);
  }

  NavigateToSIGWXCharts() {
    this.router.navigate(['/international/sigwx-charts']);
  }

  NavigateToMaximumWind() {
    this.router.navigate (['/international/grid-maximum'])
  }

  NavigateToGraphicalSigmetAirmet() {
    this.router.navigate(['/international/graphic-sigmet-airmet']);
 }

}
