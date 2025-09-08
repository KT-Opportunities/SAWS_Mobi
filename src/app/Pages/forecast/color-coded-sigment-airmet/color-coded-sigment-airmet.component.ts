import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { APIService } from '../../../services/apis.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Platform, ToastController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { Keyboard } from '@capacitor/keyboard';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-taf-accuracy-sigment-airmet',
  templateUrl: './color-coded-sigment-airmet.component.html',
  // styleUrls: ['./color-coded-sigment-airmet.component.scss'],
  styleUrls: ['./../forecast.page.scss'],
})
export class ColorCodedSigmentAirmetComponent  implements OnDestroy {
  isLoading: boolean = true;
  SigmetList: any = [];
  allSigmetList: any = []; // <-- Added to fix the error
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
    private datePipe: DatePipe,
  
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
        const firKey = sortedFirs.find(fir =>
          new RegExp(`\\b${fir}\\b`).test(afterFaor)
        );

        return {
          heading: firKey ? firMapping[firKey] : 'Unknown FIR',
          filecontent: el.filecontent,
        };
      })
      .filter(el => el.heading !== 'Unknown FIR');

  const sigmetList = processResponse(sigmets);

  this.allSigmetList = [...sigmetList]; // full backup
  this.SigmetList = [...this.allSigmetList]; // initial display
  this.filteredList = [...this.allSigmetList]; // for search filtering

  this.updateTime(new Date().toISOString());
  this.isLoading = false;
});


  }



formatSigmetForDisplay(content: string): SafeHtml {
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

  let finalText = formattedLines.join('\n').trim();

  // ✅ Highlight the word "SIGMET" in blue
  finalText = finalText.replace(
    /\bSIGMET\b/g,
    `<span style="color: #4169E1;font-weight:bold">SIGMET</span>`
  );

  // ✅ Hazard terms (green)
  finalText = finalText.replace(
    /\b(TURB)\b/g,
    `<span style="color:#4e9258;font-weight:bold">$1</span>`
  );

  // ✅ Icing (green too?)
  finalText = finalText.replace(
    /\b(MOD\s+ICE|SEV\s+ICE)\b/g,
    `<span style="color:#4e9258;font-weight:bold">$1</span>`
  );

  // ✅ Thunderstorms / convective weather (red)
  finalText = finalText.replace(
    /\b(EMBD\s+TS|TSGR|TSRA)\b/g,
    `<span style="color:#FF0000;font-weight:bold">$1</span>`
  );

  // ✅ Flight levels (blue italic)
  finalText = finalText.replace(
    /\b(SFC\/FL\d+|FL\d{3,4})\b/g,
    `<span style="color:#4169E1;font-style:italic">$1</span>`
  );

  // Convert newlines to <br>
  return this.sanitizer.bypassSecurityTrustHtml(
    finalText.replace(/\n/g, '<br>')
  );
}





filterbySearch(event?: any) {
  if (event) {
    event.preventDefault(); // prevent form submit reload
  }

  const query = this.searchQuery?.trim().toLowerCase();
  if (!query) {
    this.SigmetList = [...this.allSigmetList]; // show all if empty
    return;
  }

  this.SigmetList = this.allSigmetList.filter((sig:any) =>
    sig.heading?.toLowerCase().includes(query) || 
    sig.filecontent?.toLowerCase().includes(query)
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
