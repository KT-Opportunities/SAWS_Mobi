import {
  Component,
  inject,
  OnInit,
  ElementRef,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { APIService } from 'src/app/services/apis.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { ImageViewrPage } from '../../image-viewr/image-viewr.page';

@Component({
  selector: 'app-grid-maximum',
  templateUrl: './grid-maximum.page.html',
  styleUrls: ['./../international.page.scss'],
})
export class GridMaximumPage implements OnInit {
  isLogged: boolean = false;
  isLoading: boolean = false;

  MaximumArray: any = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,

    private http: HttpClient,

    private APIService: APIService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}
  extractTime(filename: string): string {
    const timeMatch = filename.match(/(\d{4})(?=.png$)/);
    if (timeMatch) {
      const timeString = timeMatch[0];
      const hours = timeString.substring(2, 4);
      const minutes = '00';
      return `${hours}:${minutes}`;
    }
    return '';
  }

  ngOnInit() {
    // Check if user is logged in
    // this.isLoading = true;

    if (!this.authService.getIsLoggedIn()) {
      // If not logged in, navigate to the login page
      this.router.navigate(['/login']);
    }
    this.isLoading = true;
    this.APIService.GetSourceAviationFolderFilesList('mxw').subscribe(
      (response) => {
        this.MaximumArray = response;
        console.log('Response:', this.MaximumArray);

        this.MaximumArray = response.filter((item: any) =>
          item.filename.includes('mxw_EURAFI-AREA-C')
        );
        console.log('Response after filter:', this.MaximumArray);

        console.log('Response:', this.MaximumArray);

        this.isLoading = false; // Set loading to false after processing
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.isLoading = false; // Set loading to false in case of error
        // Handle error appropriately (e.g., show error message)
      }
    );
  }
  openImageViewer(item: any) {
    const folderName = item.foldername;
    const fileName = item.filename;
    this.isLoading = true;

    this.fetchSecondAPI(folderName, fileName)
      .then((filecontent) => {
        this.isLoading = false;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = '100vw';
        dialogConfig.height = '100%';
        dialogConfig.maxWidth = '97vw';
        dialogConfig.maxHeight = '99%';
        dialogConfig.panelClass = 'custom-dialog-container';

        dialogConfig.data = { filecontent };

        const dialogRef = this.dialog.open(ImageViewrPage, dialogConfig);

        dialogRef.afterClosed().subscribe(() => {
          this.isLoading = false;
        });
      })
      .catch((error) => {
        console.error('Error fetching file content:', error);
        this.isLoading = false;
      });
  }

  fetchSecondAPI(folderName: string, fileName: string): Promise<string> {
    // Return a promise that resolves with filecontent
    return new Promise<string>((resolve, reject) => {
      this.APIService.GetChartsFile(folderName, fileName).subscribe(
        (response) => {
          // Assuming filecontent is obtained from the response
          const filecontent = response.filecontent;
          // Log filecontent to verify
          console.log('File Text Content:', filecontent);
          // Resolve the promise with filecontent
          resolve(filecontent);
        },
        (error) => {
          // Reject the promise if there's an error
          reject(error);
        }
      );
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  NavigateToInternational() {
    this.router.navigate(['/international']);
  }
}
