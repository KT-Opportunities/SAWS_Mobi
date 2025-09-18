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
  SigmetList: any[] = [];
  searchQuery: string = '';
  allSigmetList: any[] = []; // full backup

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
    this.currentDate = this.datePipe.transform(date, 'yyyy - MM - dd') ?? '';
    this.currentTime = this.datePipe.transform(date, 'HH:mm:ss') ?? '';
  }

  async loadSigmetAndAirmet() {
    this.isLoading = true;

    const firMapping: { [key: string]: string } = {
      'FACA CAPE TOWN FIR': 'FACA (CAPE TOWN FIR)',
      'FAJO JOHANNESBURG OCEANIC FIR': 'FAJO (JOHANNESBURG OCEANIC FIR)',
      'FAJA JOHANNESBURG FIR': 'FAJA (JOHANNESBURG FIR)',
    };

    const sortedFirs = Object.keys(firMapping).sort((a, b) => b.length - a.length);

    const processResponse = (response: any[]) =>
      response
        .map(el => {
          const fileContent = el.filecontent.toUpperCase();
          const afterFaor = fileContent.split('FAOR-')[1] || '';
          const firKey = sortedFirs.find(fir => new RegExp(`\\b${fir}\\b`).test(afterFaor));
          return {
            heading: firKey ? firMapping[firKey] : 'Unknown FIR',
            filecontent: el.filecontent
          };
        })
        .filter(el => el.heading !== 'Unknown FIR');

    this.apiService.GetSourceTextFolderFiles('sigmet').subscribe(sigmets => {
      this.apiService.GetSourceTextFolderFiles('airmet').subscribe(airmets => {
        const sigmetList = processResponse(sigmets);
        const airmetList = processResponse(airmets);

        this.allSigmetList = [...sigmetList, ...airmetList]; // full backup
        this.SigmetList = [...this.allSigmetList];

        this.updateTime(new Date().toISOString());
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

  // --- UPDATED SEARCH FUNCTION ---
  filterbySearch(event?: any) {
    if (event) event.preventDefault(); // prevent form submission
    const query = this.searchQuery?.trim().toLowerCase();
    if (!query) {
      this.SigmetList = [...this.allSigmetList]; // show all if empty
      return;
    }
    // Filter only matching items
    this.SigmetList = this.allSigmetList.filter(sig =>
      sig.heading?.toLowerCase().includes(query) || sig.filecontent?.toLowerCase().includes(query)
    );
  }

  // Live search as user types
  onSearchChange() {
    const query = this.searchQuery?.trim().toLowerCase();
    if (!query) {
      this.SigmetList = [...this.allSigmetList];
      return;
    }
    this.SigmetList = this.allSigmetList.filter(sig =>
      sig.heading?.toLowerCase().includes(query) || sig.filecontent?.toLowerCase().includes(query)
    );
  }

  ScrollToTop(value: any) {
    const element = document.getElementById(value);
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  forecastPageNavigation() {
    this.router.navigate(['/forecast']);
  }
}
