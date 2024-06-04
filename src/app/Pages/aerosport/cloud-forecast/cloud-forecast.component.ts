import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cloud-forecast',
  templateUrl: './cloud-forecast.component.html',
  styleUrls: ['./../aero-sport.page.scss'],
})
export class CloudForecastComponent  implements OnInit {

  isLogged: boolean = false;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private http: HttpClient,
    private apiService: APIService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {}

  NavigateToAerosport() {
    this.router.navigate(['/aero-sport']);
  }

}
