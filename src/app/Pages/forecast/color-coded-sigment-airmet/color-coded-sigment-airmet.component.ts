import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ViewDecodedPage } from '../../view-decoded/view-decoded.page';

@Component({
  selector: 'app-color-coded-sigment-airmet',
  templateUrl: './color-coded-sigment-airmet.component.html',
  // styleUrls: ['./color-coded-sigment-airmet.component.scss'],
  styleUrls: ['./../forecast.page.scss'],
})
export class ColorCodedSigmentAirmetComponent  implements OnInit {

  isLogged: boolean = false;
  loading: boolean = false;
  isLoading: boolean = true;
  item: any;


  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private iab: InAppBrowser,
    private spinner: NgxSpinnerService,
    private apiService: APIService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef
  ) {}
  ngOnInit() {}

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
