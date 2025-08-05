import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ViewDecodedPage } from '../../view-decoded/view-decoded.page';
import { FormBuilder } from '@angular/forms';
import { Platform, ToastController } from '@ionic/angular';
import { MediaMatcher } from '@angular/cdk/layout';
import { Keyboard } from '@capacitor/keyboard';

interface MetarReport {
  filecontent: string;
}

@Component({
  selector: 'app-metar-color-coded',
  templateUrl: './metar-color-coded.component.html',
  styleUrls: ['./metar-color-coded.component.scss'],
})
export class MetarColorCodedComponent implements OnInit {
  isLogged: boolean = false;
  loading: boolean = false;
  metarReports: MetarReport[] = [];
  filteredReports: MetarReport[] = [];
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
    FDMS: 'Swaziland',
    FDSK: 'Swaziland',
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
    this.currentDate = now.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
    this.currentTime = now.toLocaleTimeString(); // Format as HH:MM:SS
  }

  onSearch(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredReports = this.metarReports;
    } else {
      this.filteredReports = this.metarReports.filter((report) =>
        report.filecontent
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    }
  }

  fetchMetarReports(): void {
    this.loading = true;
    this.spinner.show();

    const foldername = 'metar';
    this.apiService.getMetarReports(foldername, 3000).subscribe(
      (data: MetarReport[]) => {
        console.log('Metar reports fetched successfully:', data);
        this.metarReports = data;
        this.filteredReports = data;
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

  getProvinceFromContent(content: any): any {
    const airportCodeMatch = content.match(/\b[A-Z]{4}\b/);
    const airportCode = airportCodeMatch ? airportCodeMatch[0] : null;

    if (airportCode && this.airportProvinceMapping[airportCode]) {
      return this.airportProvinceMapping[airportCode];
    }

    return 'Gauteng';
  }

  ImageViewer(item: any) {
    console.log('File Name:', item);
    const folderName = 'sigw';
    const fileName = item;

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
  navigateToObservation(): void {
    this.router.navigate(['/observation']);
  }
}
