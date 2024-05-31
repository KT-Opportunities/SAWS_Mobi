import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-color-coded-warnings',
  templateUrl: './color-coded-warnings.component.html',
  styleUrls: ['./color-coded-warnings.component.scss'],
})
export class ColorCodedWarningsComponent  implements OnInit {

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

  ngOnInit() {}

  forecastPageNavigation() {
    this.router.navigate(['/forecast']);
  }
}
