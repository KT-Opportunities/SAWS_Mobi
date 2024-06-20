import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageViewrPage } from '../../image-viewr/image-viewr.page';

@Component({
  selector: 'app-low-level-wind-profile',
  templateUrl: './low-level-wind-profile.component.html',
  // styleUrls: ['./low-level-wind-profile.component.scss'],
  styleUrls: ['./../domestic.page.scss'],
})
export class LowLevelWindProfileComponent implements OnInit {
  isLogged: boolean = false;
  isLoading: boolean = false;
  lowLevel: any = [];
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
      // fetch low level wind profile
    }
    this.APIService.GetSourceAviationFolderFilesList('', 72).subscribe(
      (data) => {
        console.log('Data received:', data);

        this.lowLevel = data
          .filter((item: { filename: string }) => item.filename.includes('up'))
          .map((item: { filename: string }) => item.filename);
        console.log('lowLevel:', this.lowLevel);

        this.isLoading = false;
      },
      (error) => {
        console.log('Error fetching JSON data:', error);
        this.isLoading = false;
      }
    );
  }
  openImageViewer(item: any) {
    const folderName = '';
    const fileName = item;
    console.log('file Name:', fileName);
    this.isLoading = true;

    this.fetchSecondAPI(folderName, fileName)
      .then((filetextcontent) => {
        this.isLoading = false;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = '80%';
        dialogConfig.height = '80%';
        dialogConfig.data = { filetextcontent };

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
  transformFilename(filename: string): string {
    if (filename.startsWith('up') && filename.endsWith('.gif')) {
      return filename.slice(2, -4);
    }
    return filename;
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
