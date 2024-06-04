import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageViewrPage } from '../../image-viewr/image-viewr.page';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss'],
})
export class RadarComponent  implements OnInit {

  isLogged: boolean = false;
  loading: boolean = false;
  imageNotFound: boolean = false;

  frameArray: any = [];
  fileBaseUrl: SafeResourceUrl | undefined;

  selectedOption: string = 'Individual image';
  selectedOptionFilename: string = '.gif';
  isDropdownOpen: boolean = false;
  folderName: string = '';
  lastModifiedHours: number = 12;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: APIService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog

   ) { }

  ngOnInit() {
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  NavigateToObservation() {
    this.router.navigate(['/observation']);
  }

  radarDropdownOpen() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string, dropdown: string, selectedOption: string) {
    if (dropdown === 'dropdown1') {
      this.selectedOption = selectedOption;
      this.selectedOptionFilename = option;
    } 

    if (dropdown === 'dropdown2') {
      this.selectedOption = selectedOption;
      this.selectedOptionFilename = option;
    }

    if (dropdown === 'dropdown3') {
      this.selectedOption = selectedOption;
      this.selectedOptionFilename = option;
    }

    if (dropdown === 'dropdown4') {
      this.selectedOption = selectedOption;
      this.selectedOptionFilename = option;
    }
  }


  viewImage(imagefilename: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.loading = true;

      const filename = imagefilename + this.selectedOptionFilename;

      console.log('filename', filename);


      this.apiService.GetAviationFile(this.folderName, filename).subscribe(
        (response) => {
          const filetextcontent = response.filetextcontent;
          resolve(filetextcontent);
          this.openImageViewer(filetextcontent);
        },
        (error) => {
          reject(error);
          this.loading = false;
          this.imageNotFound = true;

          setTimeout(() => {
            this.imageNotFound = false;
          }, 2000);
        }
      );
    });
  }

  openImageViewer(filetextcontent: any) {
    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.width = '80%';
      dialogConfig.height = '80%';
      dialogConfig.data = {
        filetextcontent: filetextcontent,
      };
      
      const dialogRef = this.dialog.open(ImageViewrPage, dialogConfig);
      this.loading = false;
  }

}
