import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageViewrPage } from '../../image-viewr/image-viewr.page';
import {
  PanZoomConfig,
  PanZoomAPI,
  PanZoomModel,
  PanZoomConfigOptions,
} from 'ngx-panzoom';
@Component({
  selector: 'app-gpm',
  templateUrl: './gpm.component.html',
  styleUrls: ['./../international.page.scss'],
})
export class GpmComponent  implements OnInit {
  rotationDegree = 0;
  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event: any) {
    this.updateImageRotation();
  }
  panZoomConfig: PanZoomConfig = new PanZoomConfig();
  isLogged: boolean = false;
  frameArray: any = [];
  loading : boolean = false;
  fileBaseUrl: any = null; 
  rotationAngle: number = 0; 

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
    private dialog: MatDialog,
    
  ) { }

  ngOnInit() {
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  NavigateToInternational() {
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

 // New method to rotate the image
//  rotateImage(): void {
//   this.rotationAngle += 90;
//   if (this.rotationAngle >= 360) {
//     this.rotationAngle = 0;
//   }
// }

private convertBase64ToBlob(base64: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: 'image/jpeg' });
}

// viewImage(imagefilename: string): Promise<void> { // Adjusted return type to void
//   return new Promise<void>((resolve, reject) => {
//     this.loading = true;

//     const filename = this.selectedOptionFilename + imagefilename;

//     this.APIService.GetAviationFile(this.folderName, filename).subscribe(
//       (response) => {
//         const filetextcontent = response.filetextcontent;
//         const imageBlob = this.convertBase64ToBlob(filetextcontent);
//         const imageUrl = URL.createObjectURL(imageBlob);

//         this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
//         this.rotationAngle = 0; // Reset rotation angle when a new image is loaded

//         resolve();
//         this.loading = false;
//       },
//       (error) => {
//         reject(error);
//         this.loading = false;
//       }
//     );
//   });
// }

// viewImage(imagefilename: string): Promise<void>  {
//   return new Promise<void>((resolve, reject) => {
//   this.loading = true;

//   const filename = this.selectedOptionFilename + imagefilename;

//   this.APIService.GetAviationFile(this.folderName, filename).subscribe(
//     (response) => {
//       const filetextcontent = response.filetextcontent;
//       const imageUrl = 'data:image/jpeg;base64,' + filetextcontent; // Adjust MIME type if needed

//       // Open dialog and pass image data
//       const dialogConfig = new MatDialogConfig();
//       dialogConfig.autoFocus = true;
//       dialogConfig.disableClose = true;
//       dialogConfig.width = '80%';
//       dialogConfig.height = '80%';
//       dialogConfig.data = {
//         filetextcontent: imageUrl, // Pass base64 string
//       };

//       this.dialog.open(ImageViewrPage, dialogConfig);
//       this.loading = false;
//     },
    
//     (error) => {
//       console.error(error);
//       this.loading = false;
//     }
//   );
// });
// }



viewImage(imagefilename: string): Promise<void>  {
  return new Promise<void>((resolve, reject) => {
    this.loading = true;

    const filename = this.selectedOptionFilename + imagefilename;

    this.APIService.GetAviationFile(this.folderName, filename).subscribe(
      (response) => {
        const filetextcontent = response.filetextcontent;
        const imageUrl = `data:image/jpeg;base64,${filetextcontent}`; // Ensure proper MIME type

        // Open dialog and pass image data
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = '80%';
        dialogConfig.height = '80%';
        dialogConfig.data = {
          filetextcontent: imageUrl, // Pass base64 string correctly
        };

        this.dialog.open(ImageViewrPage, dialogConfig);
        this.loading = false;
        resolve();
      },
      (error) => {
        console.error(error);
        this.loading = false;
        reject(error);
      }
    );
  });
}



  updateImageRotation() {
    switch (window.orientation) {
      case 0: // Portrait
        this.rotationDegree = 0;
        break;
      case 90: // Landscape Right
        this.rotationDegree = 90;
        break;
      case -90: // Landscape Left
        this.rotationDegree = -90;
        break;
      case 180: // Upside-down Portrait
        this.rotationDegree = 180;
        break;
      default:
        this.rotationDegree = 0;
    }
    }



  openImageViewer(filecontent: any) {
    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.width = '80%';
      dialogConfig.height = '80%';
      dialogConfig.data = {
        filecontent: filecontent,

      };
      
      const dialogRef = this.dialog.open(ImageViewrPage, dialogConfig);
      this.loading = false;
  }
  

}
