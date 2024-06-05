import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { APIService } from 'src/app/services/apis.service';
import { ImageViewrPage } from '../../image-viewr/image-viewr.page';

@Component({
  selector: 'app-sigwx-charts',
  templateUrl: './sigwx-charts.component.html',
  styleUrls: ['./../domestic.page.scss'],
})
export class SigwxChartsComponent implements OnInit {
  imageUrl: string | null = null;
  isLogged: boolean = false;
  isLoading: boolean = true;
  Sigwx: any = [];
  Sigwxh: any = [];
  Sigwxm: any = [];
  Sigwxl: any = [];
  fileBaseUrlSynoptic: SafeResourceUrl = '';

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
      this.loadSynopticData();
    }
  }

  getTimeFromFilenamexh(item: any) {
    // Extract filename without extension
    const filename = item.filename;

    // Check if filename starts with "sigwxh" and ends with ".gif"
    if (filename.startsWith('sigwxh') && filename.endsWith('.gif')) {
      // Remove "sigwxh" from the filename and strip the ".gif" extension
      const timeString = filename.slice(6, -4);

      // Check if timeString is empty, if so, return "A4-size images\nmost recent"
      if (timeString) {
        const hour = parseInt(timeString, 10);
        if (!isNaN(hour)) {
          // Return formatted hour as HH:00
          return hour < 10 ? `0${hour}:00` : `${hour}:00`;
        } else {
          return 'most recent';
        }
      } else {
        // timeString is empty after removing "sigwxh" and ".gif"
        return 'most recent';
      }
    }
    return null;
  }

  getTimeFromFilenamexm(item: any) {
    // Extract filename without extension
    const filename = item.filename;

    // Check if filename starts with "sigwxh" and ends with ".gif"
    if (filename.startsWith('sigwxm') && filename.endsWith('.gif')) {
      // Remove "sigwxh" from the filename and strip the ".gif" extension
      const timeString = filename.slice(6, -4);

      // Check if timeString is empty, if so, return "A4-size images\nmost recent"
      if (timeString) {
        const hour = parseInt(timeString, 10);
        if (!isNaN(hour)) {
          // Return formatted hour as HH:00
          return hour < 10 ? `0${hour}:00` : `${hour}:00`;
        } else {
          return 'most recent';
        }
      } else {
        // timeString is empty after removing "sigwxh" and ".gif"
        return 'most recent';
      }
    }
    return null;
  }

  getTimeFromFilenamexl(item: any) {
    const filename = item.filename;

    // Check if filename starts with "sigwxh" and ends with ".gif"
    if (filename.startsWith('sigwxl') && filename.endsWith('.gif')) {
      // Remove "sigwxh" from the filename and strip the ".gif" extension
      const timeString = filename.slice(6, -4);

      // Check if timeString is empty, if so, return "A4-size images\nmost recent"
      if (timeString) {
        const hour = parseInt(timeString, 10);
        if (!isNaN(hour)) {
          // Return formatted hour as HH:00
          return hour < 10 ? `0${hour}:00` : `${hour}:00`;
        } else {
          return 'most recent';
        }
      } else {
        // timeString is empty after removing "sigwxh" and ".gif"
        return 'most recent';
      }
    }
    return null;
  }

  loadSynopticData() {
    this.isLoading = true;
    this.APIService.GetSourceAviationFolderFilesListNull(24).subscribe(
      (data) => {
        console.log('SIGWX', data);

        data.forEach((item: any) => {
          const itemStr = JSON.stringify(item).toLowerCase();
          if (itemStr.includes('sig')) {
            if (itemStr.includes('xh')) {
              this.Sigwxh.push(item);
            } else if (itemStr.includes('xm')) {
              this.Sigwxm.push(item);
            } else if (itemStr.includes('xl')) {
              this.Sigwxl.push(item);
            }
          }
          if (itemStr.includes('ss')) {
            this.Sigwx.push(item);
          }
        });

        this.isLoading = false;
        console.log('SIGWXH', this.Sigwxh);
        console.log('SIGWXM', this.Sigwxm);
        console.log('SIGWXL', this.Sigwxl);
        console.log('SSIGW', this.Sigwx);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching JSON data:', error);
        this.isLoading = false;
      }
    );
  }

  openImageViewer(item: any) {
    // Extract folderName and fileName from the current item
    const folderName = '';
    const fileName = item.filename;
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
      this.APIService.GetAviationFile('', fileName).subscribe(
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

  NavigateToDomestic() {
    this.router.navigate(['/domestic']);
  }
  
}
