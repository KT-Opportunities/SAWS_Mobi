import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ImageViewrPage } from '../image-viewr/image-viewr.page';
@Component({
  selector: 'app-international',
  templateUrl: './international.page.html',
  styleUrls: ['./international.page.scss'],
})
export class InternationalPage implements OnInit {
  isLogged: boolean = false;
  
  ngOnInit() {}
  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  forecastPage() {
    this.router.navigate(['/landing-page']);
  }

  isFormVisible: boolean = true;
  isFormVisible1: boolean = false;
  isFormVisible2: boolean = false;
  isFormVisible3: boolean = false;
  isKwazulNatal: boolean = false;
  isSpotGfraph: boolean = false;
  isTSProbability: boolean = false;
  isCloudForecast: boolean = false;
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  isDropdownOpen4: boolean = false;
  isDropdownOpen5: boolean = false;
  selectedOption1: string = 'West';
  selectedOption2: string = 'Surface';
  selectedOption3: string = 'Temperature';
  selectedOption4: string = 'Total cloud';
  selectedOption5: string = '2023-03-20 20:00';
  nextday: boolean = true;
  prevday: boolean = false;
 

  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private APIService: APIService,
    private dialog: MatDialog
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.closeAllDropdowns();
    }
  }

  toggleDropdown(dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.isDropdownOpen1 = !this.isDropdownOpen1;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen3 = false;
    }

    if (dropdown === 'dropdown2') {
      this.isDropdownOpen2 = !this.isDropdownOpen2;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen3 = false;
    }
    if (dropdown === 'dropdown3') {
      this.isDropdownOpen3 = !this.isDropdownOpen3;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
    }
    if (dropdown === 'dropdown3') {
      this.isDropdownOpen3 = !this.isDropdownOpen3;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
    }
  }

  selectOption(option: string, dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.selectedOption1 = option;
      this.isDropdownOpen1 = false;
    } else if (dropdown === 'dropdown2') {
      this.selectedOption2 = option;
      this.isDropdownOpen2 = false;
    }
  }

  forecastDropdown(dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.isDropdownOpen1 = !this.isDropdownOpen1;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen5 = false;
    }

    if (dropdown === 'dropdown2') {
      this.isDropdownOpen2 = !this.isDropdownOpen2;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen5 = false;
    }
    if (dropdown === 'dropdown3') {
      this.isDropdownOpen3 = !this.isDropdownOpen3;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen5 = false;
    }

    if (dropdown === 'dropdown4') {
      this.isDropdownOpen4 = !this.isDropdownOpen4;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen5 = false;
    }
    if (dropdown === 'dropdown5') {
      this.isDropdownOpen5 = !this.isDropdownOpen5;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen2 = false;
    }
  }
  closeAllDropdowns() {
    this.isDropdownOpen1 = false;
    this.isDropdownOpen2 = false;
  }

  ImageBrowser() {
    this.router.navigate (['/international/image-browser'])
  }

  GPM() {
    this.router.navigate (['/international/gpm'])
  }

  GridWinds() {
    this.router.navigate(['/international/grid-winds']);
  }

  SIGWXCharts() {
    this.router.navigate(['/international/sigwx-charts']);
  }

  MaximumWind() {
    this.router.navigate (['/international/grid-maximum'])
  
  }

  GraphicalSigmetAirmet() {
    this.router.navigate(['/international/graphic-sigmet-airmet']);
 }

 Humidity() {
  this.router.navigate(['/international/humidity']);
 }


  backHome() {
    this.router.navigate(['/']);
  }
}
