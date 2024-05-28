import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-speci',
  templateUrl: './speci.component.html',
  styleUrls: ['./speci.component.scss'],
})
export class SpeciComponent  implements OnInit {

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
