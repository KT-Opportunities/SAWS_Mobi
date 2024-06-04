import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-color-coded-sigment-airmet',
  templateUrl: './color-coded-sigment-airmet.component.html',
  // styleUrls: ['./color-coded-sigment-airmet.component.scss'],
  styleUrls: ['./../forecast.page.scss'],
})
export class ColorCodedSigmentAirmetComponent  implements OnInit {

  isLogged: boolean = false;
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: APIService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {}

  forecastPageNavigation() {
    this.router.navigate(['/forecast']);
  }

}
