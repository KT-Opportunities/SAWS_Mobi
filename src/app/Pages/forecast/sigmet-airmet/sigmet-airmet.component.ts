import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { APIService } from '../../../services/apis.service';
import { NgxSpinnerService } from 'ngx-spinner';
// import { textFile } from '../advisories/advisories.component';
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


    this.getSigmetTextFiles();
  }

 
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);

    Keyboard.removeAllListeners();
  }
  updateTime(date: string ) {
    // const now = new Date();
    this.currentDate =
      this.datePipe.transform(date, 'yyyy - MM - dd') ?? '2024 - 01 - 22';
    this.currentTime = this.datePipe.transform(date, 'HH:mm:ss') ?? '13:15:45';
  }

  async getSigmetTextFiles() {
    await this.apiService
      .GetSourceTextFolderFiles('sigmet')
      .subscribe((Response) => {
        Response.forEach((element: any) => {
          element.Id = element.filecontent.split('\n')[2];

          var vwValue = element.filecontent.split('\n')[2];
          element.heading = vwValue;
        });

        this.SigmetList = Response;
        this.filteredList = Response;
        this.getAirmetTextFiles();
        console.log('Response ', this.SigmetList);

        this.updateTime(this.SigmetList[0]?.lastmodified)

         this.isLoading = false;
      });
  }
  async getAirmetTextFiles() {
    await this.apiService
      .GetSourceTextFolderFiles('airmet')
      .subscribe((Response) => {
        Response.forEach((element: any) => {
          element.Id = element.filecontent.split('\n')[2];

          var vwValue = element.filecontent.split('\n')[2];
          element.heading = vwValue;
        });

        //Push airmet into the sigmet List
        this.SigmetList.push(Response);
        this.filteredList.push(Response);
        console.log('Response - airmet  ', this.SigmetList);

        this.getGametTextFiles();
      }),
      (error: any) => {
        console.error('Error occurred while fetching airmet data: ', error);
        this.isLoading = false;
      };
  }
  async getGametTextFiles() {
    await this.apiService
      .GetSourceTextFolderFiles('gamet')
      .subscribe((Response) => {
        Response.forEach((element: any) => {
          element.Id = element.filecontent.split('\n')[2];

          var vwValue = element.filecontent.split('\n')[2];
          element.heading = vwValue;
        });
        //push gamet into the sigmet List
        this.SigmetList.push(Response);
        this.filteredList.push(Response);
        console.log('Response - gamet ', this.SigmetList);

        this.isLoading = false;
      }),
      (error: any) => {
        console.error('Error occurred while fetching gamet data: ', error);
        this.isLoading = false;
      };
  }

  filterbySearch(event: Event) {
    let element = document.getElementById('searchValue');
    console.log('value ', element);
    let filterValue = (element as HTMLInputElement).value;
    if (!filterValue) {
      this.SigmetList = this.filteredList;
      return;
    }

    this.SigmetList = this.SigmetList.filter((a: any) =>
      a.filecontent?.toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  filterNosearchValue() {
    let element = document.getElementById('searchValue');
    console.log('value ', element);
    let filterValue = (element as HTMLInputElement).value;
    if (!filterValue) {
      this.SigmetList = this.filteredList;
      return;
    }
  }

  ScrollToTop(value: any) {
    var element = document.getElementById(value);
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  forecastPage() {
    window.history.back();
    // this.router.navigate(['/forecast']);
  }

  forecastPageNavigation() {
    this.router.navigate(['/forecast']);
  }
}
