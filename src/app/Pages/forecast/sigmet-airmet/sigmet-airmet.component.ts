import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { APIService } from '../../../services/apis.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Platform, ToastController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-sigmet-airmet',
  templateUrl: './sigmet-airmet.component.html',
  styleUrls: ['./../forecast.page.scss'],
})
export class SigmetAirmetComponent implements OnInit, OnDestroy {
  isLoading: boolean = true;
  SigmetList: any = [];
  AirmetList: any = [];
  GametList: any = [];
  filteredList: any = ([] = []);
  searchQuery: string = '';

  currentDate: string | undefined;
  currentTime: string | undefined;
  intervalId: any;

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
    private sanitizer: DomSanitizer,
    private elRef: ElementRef,
    private iab: InAppBrowser,
    private datePipe: DatePipe
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
    this.loadSigmetAndAirmet();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
    Keyboard.removeAllListeners();
  }

  updateTime(date: string) {
    this.currentDate = this.datePipe.transform(date, 'yyyy - MM - dd') ?? '2024 - 01 - 22';
    this.currentTime = this.datePipe.transform(date, 'HH:mm:ss') ?? '13:15:45';
  }

  async loadSigmetAndAirmet() {
    this.isLoading = true;

    const firMapping: { [key: string]: string } = {
      'FACA CAPE TOWN FIR': 'FACA (CAPE TOWN FIR)',
      'FAJO JOHANNESBURG OCEANIC FIR': 'FAJO (JOHANNESBURG OCEANIC FIR)',
      'FAJA JOHANNESBURG FIR': 'FAJA (JOHANNESBURG FIR)',
    };

    const sortedFirs = Object.keys(firMapping).sort((a, b) => b.length - a.length);

    // Helper to process each response
    const processResponse = (response: any[]) =>
      response
        .map((el: any) => {
          const fileContent = el.filecontent.toUpperCase();
          const afterFaor = fileContent.split('FAOR-')[1] || '';
          const firKey = sortedFirs.find(fir =>
            new RegExp(`\\b${fir}\\b`).test(afterFaor)
          );

          return {
            heading: firKey ? firMapping[firKey] : 'Unknown FIR',
            filecontent: el.filecontent,
          };
        })
        .filter(el => el.heading !== 'Unknown FIR');

    // Fetch both requests in parallel
    this.apiService.GetSourceTextFolderFiles('sigmet').subscribe((sigmets: any[]) => {
      this.apiService.GetSourceTextFolderFiles('airmet').subscribe((airmets: any[]) => {
        const sigmetList = processResponse(sigmets);
        const airmetList = processResponse(airmets);

        // Combine both arrays
        this.SigmetList = [...sigmetList, ...airmetList];
         this.updateTime(new Date().toISOString());
        // Custom order
        const customOrder = ['Search', 'FAJA (JOHANNESBURG FIR)', 'FACA (CAPE TOWN FIR)', 'FAJO (JOHANNESBURG OCEANIC FIR)'];

        // Sort according to custom order
        this.SigmetList.sort((a: any, b: any) => {
          const indexA = customOrder.indexOf(a.heading);
          const indexB = customOrder.indexOf(b.heading);
          return indexA - indexB;
        });

        console.log("Combined Data (sorted):", this.SigmetList);
        this.isLoading = false;
      });
    });
  }

  formatSigmetForDisplay(content: string): string {
    if (!content) return '';

    let cleaned = content
      .replace(/[\u0000-\u0009\u000B-\u000C\u000E-\u001F]+/g, '')
      .replace(/\r\r\n|\r\n|\r/g, '\n')
      .replace(/^\s*\d+\s*$/gm, '')
      .trim();

    const startRegex = /\bFA(?:CA|JA|JO)\s+(?:SIGMET|AIRMET)\b/;
    const startIdx = cleaned.search(startRegex);
    cleaned = startIdx >= 0 ? cleaned.slice(startIdx) : cleaned;

    const endIdx = cleaned.indexOf('=');
    let singleMsg = endIdx >= 0 ? cleaned.slice(0, endIdx + 1) : cleaned;

    singleMsg = singleMsg.replace(/FAOR-(?!\n)/g, 'FAOR-\n');
    singleMsg = singleMsg.replace(/\bWI\b(?!\n)/g, 'WI\n');
    singleMsg = singleMsg.replace(/\n{2,}/g, '\n');

    const lines = singleMsg.split('\n');
    const formattedLines = lines.map(line => {
      if (line.match(/[NS]\d{4}\s+[EW]\d{5}/)) {
        const parts = line.split(/\s*-\s*/);
        const padded = parts.map(p => p.trim().padEnd(15, ' '));
        return padded.join(' - ');
      }
      return line;
    });

    return formattedLines.join('\n').trim().replace(/\n/g, '<br>');
  }

  filterbySearch(event: Event) {
    let element = document.getElementById('searchValue') as HTMLInputElement;
    const filterValue = element?.value || '';
    if (!filterValue) {
      this.SigmetList = this.filteredList;
      return;
    }

    this.SigmetList = this.SigmetList.filter((a: any) =>
      a.filecontent?.toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  ScrollToTop(value: any) {
    const element = document.getElementById(value);
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  forecastPage() {
    window.history.back();
  }

  forecastPageNavigation() {
    this.router.navigate(['/forecast']);
  }
}
