import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Keyboard } from '@capacitor/keyboard';
import { Platform } from '@ionic/angular';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./../flight-briefing.page.scss'],
})
export class EditComponent  implements OnInit {

  isLogged: boolean = false;
  loading: boolean = false;
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  selectedOption1: string = 'Select flight';
  selectedOption2: string = 'Select template';
  isKeyboardVisible = false;
  private mobileQuery: MediaQueryList;
  isMobile: boolean;
  private mobileQueryListener: () => void;
  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: APIService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private mediaMatcher: MediaMatcher,
    private platform: Platform
  ) {  this.mobileQuery = this.mediaMatcher.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => (this.isMobile = this.mobileQuery.matches);
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
    this.isMobile = this.mobileQuery.matches;

    Keyboard.addListener('keyboardWillShow', () => {
      this.isKeyboardVisible = true;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      this.isKeyboardVisible = false;
    });}

  ngOnInit() {
    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/login']);
    }

    this.platform.ready().then(() => {
      // Listen for keyboard will show event
      Keyboard.addListener('keyboardWillShow', () => {
        this.isKeyboardVisible = true;
      });

      // Listen for keyboard will hide event
      Keyboard.addListener('keyboardWillHide', () => {
        this.isKeyboardVisible = false;
      });
    });
  }
  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);

    Keyboard.removeAllListeners();
  }
  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  NavigateToFlightBriefing() {
    this.router.navigate(['/flight-briefing']);
  }

  selectOption(option: string, dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.selectedOption1 = option;
     
    } 
    if (dropdown === 'dropdown2') {
      this.selectedOption2 = option;
     
    }
   
  }

  selectDropdown(dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.isDropdownOpen1 = !this.isDropdownOpen1;
    }
    if (dropdown === 'dropdown2') {
      this.isDropdownOpen2 = !this.isDropdownOpen2;
    }
  
  }

  closeAllDropdowns() {
    this.isDropdownOpen1 = false;
    this.isDropdownOpen2 = false;
 
  }

}
