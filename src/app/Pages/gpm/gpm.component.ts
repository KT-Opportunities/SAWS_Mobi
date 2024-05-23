import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageViewrPage } from '../image-viewr/image-viewr.page';

@Component({
  selector: 'app-gpm',
  templateUrl: './gpm.component.html',
  styleUrls: ['../../international/international.page.scss'],
})
export class GpmComponent  implements OnInit {

  isLogged: boolean = false;
  frameArray: any = [];

  fileBaseUrl: SafeResourceUrl | undefined;
  loading: boolean = false;

  selectedOption: string = 'West';
  selectedOptionFilename: string = 'gw_west';
  isDropdownOpen: boolean = false;
  folderName: string = 'gw';
  lastModifiedHours: number = 12;

  constructor(
    private router: Router,
    private authService: AuthService,
    private APIService: APIService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  internationalPageNavigation() {
    this.router.navigate(['/international']);
  }

  gpmDropdownOpen() {
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

      const filename = this.selectedOptionFilename + imagefilename;


      this.APIService.GetAviationFile(this.folderName, filename).subscribe(
        (response) => {
          const filetextcontent = response.filetextcontent;
          resolve(filetextcontent);
          this.openImageViewer(filetextcontent);
        },
        (error) => {
          reject(error);
          this.loading = false;
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
