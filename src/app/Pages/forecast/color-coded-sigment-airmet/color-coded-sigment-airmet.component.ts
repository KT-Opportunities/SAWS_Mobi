import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ViewDecodedPage } from '../../view-decoded/view-decoded.page';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-taf-accuracy-sigment-airmet',
  templateUrl: './color-coded-sigment-airmet.component.html',
  // styleUrls: ['./color-coded-sigment-airmet.component.scss'],
  styleUrls: ['./../forecast.page.scss'],
})
export class ColorCodedSigmentAirmetComponent  implements OnInit, OnDestroy {

  isLogged: boolean = false;
  loading: boolean = false;
  isLoading: boolean = true;
  item: any;

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
    private cdRef: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {}
  ngOnInit() {

    this.updateTime();
    this.intervalId = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  updateTime() {
    const now = new Date();
    this.currentDate = this.datePipe.transform(now, 'yyyy - MM - dd') ?? '2024 - 01 - 22';;
    this.currentTime = this.datePipe.transform(now, 'HH:mm:ss') ?? '13:15:45';;

  }

  forecastPageNavigation() {
    this.router.navigate(['/forecast']);
  }
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

  ScrollToTop(value: any) {
    var element = document.getElementById(value);
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}
