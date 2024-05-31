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
  isLoading: boolean = true;
  
  MaximumArray: any = [];


  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,

    private http: HttpClient,

    private APIService: APIService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
  
  }
  extractTime(filename: string): string {
    const timeMatch = filename.match(/(\d{4})(?=.png$)/);
    if (timeMatch) {
      const timeString = timeMatch[0];
      const hours = timeString.substring(0, 2);
      const minutes = timeString.substring(2, 4);
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
    debugger;
    this.APIService.GetSourceChartFolderFilesList('PW').subscribe(
      (response) => {
        this.MaximumArray = response;
        console.log('Response:', this.MaximumArray);

        this.MaximumArray = response.filter((item: any) =>
          item.filename.includes('PWRD98')
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
    // Extract folderName and fileName from the current item
    const folderName = item.foldername;
    const fileName = item.filename;
    debugger;
    console.log('file Name:', fileName);

    // Call fetchSecondAPI to get filetextcontent asynchronously
    this.fetchSecondAPI(folderName, fileName).then((filetextcontent) => {
      // Once filetextcontent is retrieved, open the dialog with necessary data
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.width = '80%'; // Set custom width
      dialogConfig.height = '80%'; // Set custom height
      dialogConfig.data = {
        filetextcontent: filetextcontent,
        // Add any additional data you want to pass to the dialog here
      };

      const dialogRef = this.dialog.open(ImageViewrPage, dialogConfig);
    });
  }

  fetchSecondAPI(folderName: string, fileName: string): Promise<string> {
    // Return a promise that resolves with filetextcontent
    return new Promise<string>((resolve, reject) => {
      this.APIService.GetChartsFile(folderName, fileName).subscribe(
        (response) => {
          // Assuming filetextcontent is obtained from the response
          const filetextcontent = response.filetextcontent;
          // Log filetextcontent to verify
          console.log('File Text Content:', filetextcontent);
          // Resolve the promise with filetextcontent
          resolve(filetextcontent);
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

  International() {
    this.router.navigate(['/international']);
  }
}
