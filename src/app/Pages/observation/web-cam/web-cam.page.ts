import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { APIService } from 'src/app/services/apis.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-web-cam',
  templateUrl: './web-cam.page.html',
  styleUrls: ['./web-cam.page.scss'],
})
export class WebCamPage implements OnInit {
  isLogged: boolean = false;
  webcamActive: boolean = false;
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: APIService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {}

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  observationPageNavigation() {
    this.router.navigate(['/observation']);
  }


}
