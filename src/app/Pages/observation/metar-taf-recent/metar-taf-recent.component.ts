import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-metar-taf-recent',
  templateUrl: './metar-taf-recent.component.html',
  styleUrls: ['./metar-taf-recent.component.scss'],
})
export class MetarTafRecentComponent  implements OnInit {

  isLogged: boolean = false;
  loading: boolean = false;

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
