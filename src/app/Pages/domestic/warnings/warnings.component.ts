import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-warnings',
  templateUrl: './warnings.component.html',
  // styleUrls: ['./warnings.component.scss'],
  styleUrls: ['./../domestic.page.scss'],
})
export class WarningsComponent  implements OnInit {

  isLogged: boolean = false;
  isLoading: boolean = false;
  warnings: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private APIService: APIService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.fetchWarnings();
    }
  }

  fetchWarnings() {
    // Set loading to true when starting data fetch
    this.isLoading = true;

    // Display the loading indicator
    this.spinner.show();

    this.APIService.GetSourceTextFolderFiles('unknown').subscribe(
      (data: any[]) => {
        console.log('Received warnings:', data);
        this.warnings = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching warnings:', error);
        // Hide the loading indicator in case of error
        this.spinner.hide();
      },
      () => {
        // Hide the loading indicator when data is successfully loaded or in case of error
        this.isLoading = false;
        this.spinner.hide();
      }
    );
  }

  NavigateToDomestic() {
    this.router.navigate(['/domestic']);
  }

}
