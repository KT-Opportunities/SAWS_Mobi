import {
  Component,
  inject,
  OnInit,
  ElementRef,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-aero-sport',
  templateUrl: './aero-sport.page.html',
  styleUrls: ['./aero-sport.page.scss'],
})
export class AeroSportPage implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private spinner: NgxSpinnerService,
    private http: HttpClient,

    private APIService: APIService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
  
  }


  ngOnInit() {
    // Check if user is logged in
    // this.isLoading = true;

    if (!this.authService.getIsLoggedIn()) {
      // If not logged in, navigate to the login page
      this.router.navigate(['/login']);
    }

  }




  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  CentralInterior() {
  
    if (this.isLoggedIn == true) {
      this.spinner.show();
      this.router.navigate(['aero-sport/central-interior']);
    }
  }
  SouthWesternCape() {
    this.router.navigate(['aero-sport/south-west-cape']);
  }
  SynopticAnalysis() {
    this.router.navigate(['aero-sport/synoptic-analysis']);

  }

  KwazulNatalToggle() {
    this.router.navigate(['aero-sport/kwazulu-natal']);
  }
  SpotGraphToggle() {
    this.router.navigate(['aero-sport/spot-graph-map']);
  }
  TSProbability() {

    this.router.navigate(['aero-sport/tsprobability']);
  }
  aerosportPage() {
    this.router.navigate(['/landing-page']);
  }

  forecastPage() {

  }
  CloudForecast() {

    this.router.navigate(['/aero-sport/cloud-cover']);
  }



}
