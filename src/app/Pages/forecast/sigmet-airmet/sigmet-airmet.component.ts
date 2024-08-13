import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { APIService } from '../../../services/apis.service';
import { NgxSpinnerService } from 'ngx-spinner';
// import { textFile } from '../advisories/advisories.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
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

  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private iab: InAppBrowser,
    private spinner: NgxSpinnerService,
    private apiService: APIService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.updateTime();
    this.intervalId = setInterval(() => {
      this.updateTime();
    }, 1000);

    this.getSigmetTextFiles();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  updateTime() {
    const now = new Date();
    this.currentDate =
      this.datePipe.transform(now, 'yyyy - MM - dd') ?? '2024 - 01 - 22';
    this.currentTime = this.datePipe.transform(now, 'HH:mm:ss') ?? '13:15:45';
  }

  async getSigmetTextFiles() {
    await this.apiService
      .GetSourceTextFolderFiles('sigmet')
      .subscribe((Response) => {
        Response.forEach((element: any) => {
          element.Id = element.filetextcontent.split('\n')[2];

          var vwValue = element.filetextcontent.split('\n')[2];
          element.heading = vwValue;
        });

        this.SigmetList = Response;
        this.filteredList = Response;
        this.getAirmetTextFiles();
        console.log('Response ', this.SigmetList);

        // this.isLoading = false;
      });
  }
  async getAirmetTextFiles() {
    await this.apiService
      .GetSourceTextFolderFiles('airmet')
      .subscribe((Response) => {
        Response.forEach((element: any) => {
          element.Id = element.filetextcontent.split('\n')[2];

          var vwValue = element.filetextcontent.split('\n')[2];
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
          element.Id = element.filetextcontent.split('\n')[2];

          var vwValue = element.filetextcontent.split('\n')[2];
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
      a.filetextcontent?.toLowerCase().includes(filterValue.toLowerCase())
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
