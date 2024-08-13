import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ViewDecodedPage } from '../../view-decoded/view-decoded.page';

@Component({
  selector: 'app-taf-accuracy',
  templateUrl: './taf-accuracy.page.html',
  styleUrls: ['./../forecast.page.scss'],
})
export class TafAccuracyPage implements OnInit {

  loading = false;
  isLogged: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private iab: InAppBrowser,
    private spinner: NgxSpinnerService,
    private apiService: APIService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  forecastPageNavigation() {
    this.router.navigate(['/forecast']);
  }


  ScrollToTop(value: any) {
    var element = document.getElementById(value);
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}
