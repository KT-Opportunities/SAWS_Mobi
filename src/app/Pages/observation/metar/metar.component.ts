import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Renderer2,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ViewDecodedPage } from '../../view-decoded/view-decoded.page';
import { of } from 'rxjs';
import { switchMap, catchError, shareReplay } from 'rxjs/operators';
import { MediaMatcher } from '@angular/cdk/layout';
import { FormBuilder } from '@angular/forms';
import { Platform, ToastController } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';

export interface Metar {
  raw_text: string;
  color?: string;
}

@Component({
  selector: 'app-metar',
  templateUrl: './metar.component.html',
  styleUrls: ['./metar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Enables OnPush change detection
})
export class MetarComponent implements OnInit {
  isLogged: boolean = false;
  loading: boolean = false;
  metarReports: any[] = [];
  metarData: Metar[] = [];
  searchQuery: string = '';
  currentDate: string | undefined;
  currentTime: string | undefined;

  isLoading: boolean = true;
  item: any;


  isKeyboardVisible = false;
  private mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  isMobile: boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mediaMatcher: MediaMatcher,
    private authService: AuthService,
    private apiService: APIService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private renderer: Renderer2,
    private toastController: ToastController,
    private platform: Platform,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
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
  ngOnInit() {
    this.fetchMetarReports();
    this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }
  updateDateTime() {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
    this.currentTime = now.toLocaleTimeString(); // Format as HH:MM:SS
  }
  NavigateToObservation() {
    this.router.navigate(['/observation']);
  }
  fetchMetarReports(): void {
    this.loading = true;
    this.spinner.show();

    const foldername = 'metar';
    this.apiService.getRecentTafs(foldername).subscribe(
      (data: any) => {
        console.log('Metar reports fetched successfully:', data);
        this.metarReports = data;
        this.loading = false;
        this.spinner.hide();
        this.cdr.detectChanges(); // Trigger change detection
      },
      (error) => {
        console.error('Error fetching Metar Reports:', error);
        this.loading = false;
        this.spinner.hide();
        this.cdr.detectChanges(); // Trigger change detection
      }
    );
  }

  // Handle search form submission
  onSearch(event: Event) {
    event.preventDefault();
    this.searchQuery = this.searchQuery.trim().toLowerCase();
  }

  // Filter metarReports based on search query
  get filteredmetarReports(): any[] {
    if (!this.searchQuery) {
      return this.metarReports;
    }
    return this.metarReports.filter((item) =>
      item.filecontent.toLowerCase().includes(this.searchQuery)
    );
  }

  ImageViewer(item: any) {
    console.log('File Name:', item);
    const folderName = 'sigw';
    const fileName = item;

    this.isLoading = true;

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
