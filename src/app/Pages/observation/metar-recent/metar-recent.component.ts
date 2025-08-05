import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ViewDecodedPage } from '../../view-decoded/view-decoded.page';
import { MediaMatcher } from '@angular/cdk/layout';
import { FormBuilder } from '@angular/forms';
import { Platform, ToastController } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-metar-recent',
  templateUrl: './metar-recent.component.html',
  styleUrls: ['./metar-recent.component.scss'],
})
export class MetarRecentComponent implements OnInit {
  isLogged: boolean = false;
  loading: boolean = false;
  recentTafs: any[] = [];

  isKeyboardVisible = false;
  private mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  isMobile: boolean;
  intervalId: any;
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  isDropdownOpen4: boolean = false;
  isDropdownOpen5: boolean = false;
  isDropdownOpen6: boolean = false;
  isDropdownOpen7: boolean = false;
  isDropdownOpen8: boolean = false;
  isDropdownOpen11: boolean = false;
  isDropdownOpen: boolean = false;
  selectedOption1: string = 'Animation Type';
  selectedOption2: string = '2024-03-20 13:15';
  selectedOption3: string = 'FAVV';
  selectedOption11: string = 'Select Plot meteogram';
  selectedOption5: string = 'Select saved Template';
  selectedOption6: string = 'Last Hour';
  selectedOption7: string = '5 Min';
  selectedOption8: string = '2024-03-20 13:15';


  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: APIService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private mediaMatcher: MediaMatcher,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private toastController: ToastController,
    private platform: Platform,
    private cdr: ChangeDetectorRef
  ) {
    this.mobileQuery = this.mediaMatcher.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => (this.isMobile = this.mobileQuery.matches);
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
    this.isMobile = this.mobileQuery.matches;

    Keyboard.addListener('keyboardWillShow', () => {
      this.isKeyboardVisible = true;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      this.isKeyboardVisible = false;
    });
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
    Keyboard.removeAllListeners();
  }

  ngOnInit() {}

  NavigateToObservation() {
    this.router.navigate(['/observation']);
  }

  fetchRecentTafs(): void {
    debugger;
    this.loading = true; // Set loading to true when fetching starts
    this.spinner.show(); // Show the spinner

    const foldername = 'taffc'; // Specify the folder name
    this.apiService.getRecentTafsTime(foldername, 6).subscribe(
      (data) => {
        // Assign fetched data to recentTafs array
        this.recentTafs = data;
        debugger;
        console.log('TEST:', this.recentTafs);
        // Set loading to false when fetching is complete
        this.loading = false;
        // Hide the spinner
        this.spinner.hide();
      },
      (error) => {
        // Log error to console
        console.error('Error fetching recent TAFs:', error);
        // Set loading to false when an error occurs
        this.loading = false;
        // Hide the spinner
        this.spinner.hide();
      }
    );
  }

  selectOption(option: string, dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.selectedOption1 = option;
      this.isDropdownOpen1 = false;
    }
    if (dropdown === 'dropdown2') {
      this.selectedOption2 = option;
      this.isDropdownOpen2 = false;
    }
    if (dropdown === 'dropdown3') {
      this.selectedOption3 = option;
      this.isDropdownOpen2 = false;
    }
    if (dropdown === 'dropdown11') {
      this.selectedOption11 = option;
      this.isDropdownOpen5 = false;
    }
  }

  selectDropdown(dropdown: string) {
    if (dropdown === 'dropdown5') {
      this.isDropdownOpen5 = !this.isDropdownOpen5;
      this.isDropdownOpen6 = false;
      this.isDropdownOpen7 = false;
      this.isDropdownOpen11 = false;
    }
    if (dropdown === 'dropdown6') {
      this.isDropdownOpen6 = !this.isDropdownOpen6;
      this.isDropdownOpen5 = false;
      this.isDropdownOpen7 = false;
    }
    if (dropdown === 'dropdown7') {
      this.isDropdownOpen7 = !this.isDropdownOpen7;
      this.isDropdownOpen6 = false;
      this.isDropdownOpen5 = false;
    }
    if (dropdown === 'dropdown11') {
      this.isDropdownOpen11 = !this.isDropdownOpen11;
      this.isDropdownOpen5 = false;
    }
  }
  isLoading: boolean = true;
  item: any;
  ImageViewer(item: any) {
    console.log('file Name:', item);
    const folderName = 'sigw';
    const fileName = item;
    console.log('Folder Name:', folderName);
    this.isLoading = true;

    this.isLoading = false;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '80%';
    dialogConfig.height = '80%';
    dialogConfig.data = { item };

    const dialogRef = this.dialog.open(ViewDecodedPage, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      this.isLoading = false;
    });
  }
}
