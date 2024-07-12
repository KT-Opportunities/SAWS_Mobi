import {
  Component,
  inject,
  OnInit,
  ElementRef,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
// import { ImageViewrPage } from '../Pages/image-viewr/image-viewr.page';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ImageViewrPage } from '../image-viewr/image-viewr.page';
interface ResponseItem {
  foldername: string;
  filename: string;
  lastmodified: string;
  filetextcontent: string;
  // Add other properties if needed
}
interface FileData {
  foldername: string;
  filename: string;
  lastmodified: string;
  filetextcontent: string;
}

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.page.html',
  styleUrls: ['./forecast.page.scss'],
})
export class ForecastPage implements OnInit {
  isLogged: boolean = false; 
  
  loading = false;
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {}

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
