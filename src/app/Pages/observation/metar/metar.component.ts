import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Renderer2,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
import { ViewColorCodedStylePage } from '../../Pages/view-color-coded-style/view-color-coded-style.page';

export interface Metar {
  raw_text: string;
  color?: string;
}

export interface MetarReport {
  filecontent: string;
  filename?: string;
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
   coded: boolean=true;
   metarReports: MetarReport[] = [];
   filteredReports: MetarReport[] = [];
   groupedReportsByProvince: { [province: string]: MetarReport[] } = {};
   searchQuery: string = '';
   currentDate: string | undefined;
   currentTime: string | undefined;
   selectedProvince: string = 'Gauteng';
 
   airportProvinceMapping: { [key: string]: string } = {
     FAOR: 'Gauteng',
     FALA: 'Gauteng',
     FAJB: 'Gauteng',
     FAIR: 'Gauteng',
     FAWB: 'Gauteng',
     FAWK: 'Gauteng',
     FAGC: 'Gauteng',
     FAGM: 'Gauteng',
     FASI: 'Gauteng',
     FAVV: 'Gauteng',
     FAPP: 'Limpopo',
     FALM: 'Limpopo',
     FAHS: 'Limpopo',
     FATH: 'Limpopo',
     FATV: 'Limpopo',
     FAER: 'Limpopo',
     FATZ: 'Limpopo',
     FATI: 'Limpopo',
     FAVM: 'Limpopo',
     FAKN: 'Mpumalanga',
     FANS: 'Mpumalanga',
     FAEO: 'Mpumalanga',
     FASR: 'Mpumalanga',
     FAWI: 'Mpumalanga',
     FAKP: 'Mpumalanga',
     FASZ: 'Mpumalanga',
     FAMM: 'Northwest Province',
     FALI: 'Northwest Province',
     FAKD: 'Northwest Province',
     FARG: 'Northwest Province',
     FAPN: 'Northwest Province',
     FAPS: 'Northwest Province',
     FAMK: 'Northwest Province',
     FACT: 'Western Cape',
     FAGG: 'Western Cape',
     FALW: 'Western Cape',
     FAOB: 'Western Cape',
     FABY: 'Western Cape',
     FAPG: 'Western Cape',
     FAYP: 'Western Cape',
     FAOH: 'Western Cape',
     FAPE: 'Eastern Cape',
     FAEL: 'Eastern Cape',
     FAUT: 'Eastern Cape',
     FABE: 'Eastern Cape',
     FALE: 'KwaZulu Natal',
     FAPM: 'KwaZulu Natal',
     FARB: 'KwaZulu Natal',
     FAMG: 'KwaZulu Natal',
     FAVG: 'KwaZulu Natal',
     FAGY: 'KwaZulu Natal',
     FAUL: 'KwaZulu Natal',
     FALY: 'KwaZulu Natal',
     FANC: 'KwaZulu Natal',
     FAMX: 'KwaZulu Natal',
     FABL: 'Freestate',
     FABM: 'Freestate',
     FAWM: 'Freestate',
     FAHV: 'Freestate',
     FAKS: 'Freestate',
     FAFB: 'Freestate',
     FAUP: 'Northern Cape',
     FAKM: 'Northern Cape',
     FADY: 'Northern Cape',
     FACV: 'Northern Cape',
     FASB: 'Northern Cape',
     FAAB: 'Northern Cape',
     FASS: 'Northern Cape',
     FDMS: 'Eswatini',
     FDSK: 'Eswatini',
     FXMM: 'Lesotho',
     FBSK: 'Botswana',
     FBMN: 'Botswana',
     FBFT: 'Botswana',
     FBGZ: 'Botswana',
     FBJW: 'Botswana',
     FBKE: 'Botswana',
     FBMP: 'Botswana',
     FBPA: 'Botswana',
     FBTE: 'Botswana',
     FBTS: 'Botswana',
     FBSN: 'Botswana',
     FBSP: 'Botswana',
     FBSW: 'Botswana',
     FBLT: 'Botswana',
     FYWH: 'Namibia',
     FYWW: 'Namibia',
     FYWE: 'Namibia',
     FYKM: 'Namibia',
     FYKT: 'Namibia',
     FYWB: 'Namibia',
     FYGF: 'Namibia',
     FYLZ: 'Namibia',
     FYOA: 'Namibia',
     FYOG: 'Namibia',
     FYRU: 'Namibia',
     FQMA: 'Mozambique',
     FQBR: 'Mozambique',
     FQNP: 'Mozambique',
     FQIN: 'Mozambique',
     FQLC: 'Mozambique',
     FQPB: 'Mozambique',
     FQQL: 'Mozambique',
     FQTE: 'Mozambique',
     FQTT: 'Mozambique',
     FQVL: 'Mozambique',
     FVRG: 'Zimbabwe',
     FVJN: 'Zimbabwe',
     FVKB: 'Zimbabwe',
     FVFA: 'Zimbabwe',
     FVCZ: 'Zimbabwe',
     FVTL: 'Zimbabwe',
     FVWN: 'Zimbabwe',
     FWKI: 'Other Regions',
     FWCL: 'Other Regions',
     FLKK: 'Other Regions',
     FLSK: 'Other Regions',
     FNLU: 'Other Regions',
     FLHN: 'Other Regions',
     FLND: 'Other Regions',
     FAME: 'Other Stations',
   };
 
   isKeyboardVisible = false;
   private mobileQuery: MediaQueryList;
   private mobileQueryListener: () => void;
   isMobile: boolean;
   intervalId: any;
 
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
 
   ngOnInit() {
     this.fetchMetarReports();
     this.updateDateTime();
     setInterval(() => {
       this.updateDateTime();
     }, 1000);
   }
 
   updateDateTime() {
     const now = new Date();
     this.currentDate = now.toLocaleDateString('en-CA');
     this.currentTime = now.toLocaleTimeString();
   }
 
   onSearch(): void {
     if (this.searchQuery.trim() === '') {
       this.filteredReports = this.metarReports;
     } else {
       this.filteredReports = this.metarReports.filter((report) =>
         report.filecontent.toLowerCase().includes(this.searchQuery.toLowerCase())
       );
     }
     this.groupFilteredReportsByProvince(); // <== Call grouping here
   }
 
   fetchMetarReports(): void {
     this.loading = true;
     this.spinner.show();
 
     const foldername = 'metar';
     this.apiService.getMetarReports(foldername, 3000).subscribe(
       (data: MetarReport[]) => {
         console.log('Raw Metar reports fetched:', data);
 
         let allReports: string[] = [];
         for (const rawItem of data) {
           const parsedReports = this.parseRawMetarData(rawItem.filecontent);
           allReports = allReports.concat(parsedReports);
         }
 
         this.metarReports = allReports.map(report => ({ filecontent: report }));
         this.filteredReports = [...this.metarReports];
 
         this.groupFilteredReportsByProvince(); // <== Call grouping here
 
         this.loading = false;
         this.spinner.hide();
       },
       (error) => {
         console.error('Error fetching Metar Reports:', error);
         this.loading = false;
         this.spinner.hide();
       }
     );
   }
 
   getProvinceFromContent(content: string): string {
     const match = content.match(/\b([A-Z]{4})\b/);
     if (match) {
       const icao = match[1];
       if (icao in this.airportProvinceMapping) {
         return this.airportProvinceMapping[icao];
       }
     }
     return ''; // Always return string
   }
 
 // Helper: parse "071430Z" date/time string to a Date object (UTC)
 parseMetarTimestamp(metar: string): Date | null {
   const regex = /METAR\s+[A-Z]{4}\s+(\d{2})(\d{2})(\d{2})Z/;
   const match = metar.match(regex);
   if (!match) return null;
 
   const day = parseInt(match[1], 10);
   const hour = parseInt(match[2], 10);
   const minute = parseInt(match[3], 10);
 
   // Construct a date with current month/year, day/hour/minute UTC
   const now = new Date();
   const year = now.getUTCFullYear();
   const month = now.getUTCMonth();
 
   return new Date(Date.UTC(year, month, day, hour, minute));
 }
 
 groupFilteredReportsByProvince(): void {
   this.groupedReportsByProvince = {};
 
   for (const report of this.filteredReports) {
     const content = report.filecontent;
     const airportMatch = content.match(/\b([A-Z]{4})\b/);
     if (!airportMatch) continue;
 
     const airportCode = airportMatch[1];
     const province = this.airportProvinceMapping[airportCode];
     if (!province) continue;
 
     const reportDate = this.parseMetarTimestamp(content);
     if (!reportDate) continue;
 
     if (!this.groupedReportsByProvince[province]) {
       this.groupedReportsByProvince[province] = [];
     }
 
     // Find if a report for this airport already exists
     const existingIndex = this.groupedReportsByProvince[province].findIndex(
       (r) => {
         const match = r.filecontent.match(/\b([A-Z]{4})\b/);
         return match && match[1] === airportCode;
       }
     );
 
     if (existingIndex === -1) {
       this.groupedReportsByProvince[province].push(report);
     } else {
       // Compare existing report's timestamp
       const existingReport = this.groupedReportsByProvince[province][existingIndex];
       const existingDate = this.parseMetarTimestamp(existingReport.filecontent);
 
       if (existingDate && reportDate > existingDate) {
         // Replace with newer report
         this.groupedReportsByProvince[province][existingIndex] = report;
       }
     }
   }
 }
 
 
   // Needed to loop over object keys in template
   objectKeys(obj: any): string[] {
     return Object.keys(obj);
   }
 
   parseRawMetarData(rawData: string): string[] {
     const parts = rawData.split(/(?=METAR )/g);
 
     const metarReports = parts
       .map(s => {
         s = s.trim();
         const equalIndex = s.indexOf('=');
         return equalIndex !== -1 ? s.substring(0, equalIndex + 1) : s;
       })
       .filter(s => s.startsWith('METAR'));
 
     return metarReports;
   }
 
   ImageViewer(item: any) {
     const dialogConfig = new MatDialogConfig();
     dialogConfig.autoFocus = true;
     dialogConfig.disableClose = true;
     dialogConfig.width = '80%';
     dialogConfig.height = '80%';
     dialogConfig.data = { item };
 
     const dialogRef = this.dialog.open(ViewDecodedPage, dialogConfig);
 
     dialogRef.afterClosed().subscribe(() => {
       this.loading = false;
     });
   }
 
   NavigateToObservation(): void {
     this.router.navigate(['/observation']);
   }
 
   ViewColorCodedStyle() {
     const dialogConfig = new MatDialogConfig();
     dialogConfig.autoFocus = true;
     dialogConfig.disableClose = true;
     dialogConfig.width = '80%';
     dialogConfig.height = '80%';
 
 
     const dialogRef = this.dialog.open(ViewColorCodedStylePage, dialogConfig);
 
     dialogRef.afterClosed().subscribe(() => {
       this.loading = false;
     });
   }
 parseColorCoded(metar: string): SafeHtml {
   if (!metar) return '';
 
   let colored = metar;
 
   // Color wind speed (e.g. 36009KT) - blue shades depending on speed
   colored = colored.replace(/(\d{3})(\d{2})KT/g, (_match, dir, speed) => {
     const speedNum = parseInt(speed, 10);
     let color = '#00386c'; // blue-light default
     if (speedNum > 10) color = '#00008b';       // blue-bold
     else if (speedNum > 5) color = '#00386c';   // blue-medium
 
     return `<span style="color: ${color};">${dir}${speed}KT</span>`;
   });
 
   // Color variable wind direction (e.g. 290V040) - black
   colored = colored.replace(/(\d{3}V\d{3})/g, '<span style="color:#00008b;">$1</span>');
 
   // Visibility 9999 or similar - blue
   colored = colored.replace(/\b9999\b/g, '<span style="color: #00008b;">9999</span>');
 
   // Clouds: FEW, SCT, BKN, OVC with height (in hundreds of feet)
   colored = colored.replace(/(FEW|SCT|BKN|OVC)(\d{3})/g, (_match, type, level) => {
     const levelNum = parseInt(level, 10);
     const heightMeters = levelNum * 30.48;
     let color = '';
 
     if (type === 'BKN' || type === 'OVC') {
       if (heightMeters < 1000) color = '#00008b';    // blue-bold
       else if (heightMeters < 3000) color = 'orange';
       else color = 'yellow';
     } else {
       color = 'green'; // FEW and SCT clouds
     }
 
     return `<span style="color: ${color};">${type}${level}</span>`;
   });
 
   // Temperature/Dewpoint (e.g. 17/05, M02/M04) with color logic
   colored = colored.replace(/(\s|^)(M?\d{2})\/(M?\d{2})(\s|$)/g, (_match, pre, tempStr, dewStr, post) => {
     const temp = parseInt(tempStr.replace('M', '-'), 10);
     const dew = parseInt(dewStr.replace('M', '-'), 10);
     const diff = Math.abs(temp - dew);
 
     let color = 'teal'; // default
     if (temp === dew) color = 'lime';
     else if (diff < 5) color = 'green';
     else if (diff > 10) color = 'red';
 
     return `${pre}<span style="color: ${color};">${tempStr}/${dewStr}</span>${post}`;
   });
 
   // QNH pressure (Qxxxx) - purple
   colored = colored.replace(/Q(\d{4})/g, '<span style="color: #00386c;">Q$1</span>');
 
   // Trend keywords (NOSIG, BECMG, TEMPO, NSW) - blue bold
   colored = colored.replace(/\b(NOSIG|BECMG|TEMPO|NSW)\b/g, '<span style="color:#00386c; font-weight: bold;">$1</span>');
 
   // Remarks keyword RMK - orange
   colored = colored.replace(/\b(RMK)\b/g, '<span style="color: orange;">$1</span>');
 
   // End '=' sign - gray
   colored = colored.replace(/=$/, '<span style="color: gray;">=</span>');
 
   // *** Your requested addition: color missing/unknown weather groups like //// // ////// as purple bold ***
   colored = colored.replace(/(\/{4}( \/{2})?( \/{6})?)/g, '<span style="color: purple; font-weight: bold;">$1</span>');
 
   return this.sanitizer.bypassSecurityTrustHtml(colored);
 }
 
 
 viewMode: { [key: string]: 'normal' | 'color' } = {};
 
 toggleView(report: any) {
   const key = report.filename; // Use a unique property per report
   this.viewMode[key] = this.viewMode[key] === 'color' ? 'normal' : 'color';
 }
 toggleCoded(): void {
   this.coded = !this.coded;
 }
}
