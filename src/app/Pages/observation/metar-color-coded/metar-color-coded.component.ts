import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-metar-color-coded',
  templateUrl: './metar-color-coded.component.html',
  styleUrls: ['./metar-color-coded.component.scss'],
})
export class MetarColorCodedComponent  implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private APIService: APIService,
    private sanitizer: DomSanitizer

   ) { }

  ngOnInit() {}

  observationPageNavigation() {
    this.router.navigate(['/observation']);
  }

}
