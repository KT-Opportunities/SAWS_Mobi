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
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from '../../image-modal/image-modal.page';

@Component({
  selector: 'app-sigwx-charts',
  templateUrl: './sigwx-charts.component.html',
  styleUrls: ['./../international.page.scss'],
})
export class SigwxChartsComponent implements OnInit {
  isLogged: boolean = false;
  isLoading: boolean = false;
  loading: boolean = false;
  isCloudForecast: boolean = false;
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  isDropdownOpen4: boolean = false;
  isDropdownOpen5: boolean = false;
  //selectedOption1: string = 'Low';
  selectedOption = 'Africa';
  selectedOption2: string = 'Africa';
  selectedOption3: string = 'Africa';
  selectedOption4: string = 'Africa';
 
  WAFS: any = [];
  SIGW: any = [];
  ImageArray: any = [];
  fileBaseUrl: SafeResourceUrl | undefined;
  fileBaseUrlNext: SafeResourceUrl;
  fileBaseUrlPrevious: SafeResourceUrl;
  fileBaseUrlSynoptic: SafeResourceUrl;

  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,

    private http: HttpClient,

    private APIService: APIService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private moodalCtrl: ModalController,
  ) {
    this.fileBaseUrlNext = this.sanitizer.bypassSecurityTrustResourceUrl('');
    this.fileBaseUrlPrevious =
      this.sanitizer.bypassSecurityTrustResourceUrl('');
    this.fileBaseUrlSynoptic =
      this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  getTimeFromFilename(imageName: any) {
    // Extract the portion before '.gif'

    const baseName = imageName.split('.png')[0];

    // Extract the last two characters
    const time = baseName.slice(-2);

    // Return the formatted time or 'outlook'
    return `${time}:00`;
  }

  ngOnInit() {
    // Check if user is logged in
    this.isLoading = true;

    if (!this.authService.getIsLoggedIn()) {
      // If not logged in, navigate to the login page
      this.router.navigate(['/login']);
    }

    this.APIService.GetSourceAviationFolderFilesList('sigw').subscribe(
      (data) => {
        console.log('Data received:', data);

        // Filter items that contain '_egrr'
        this.WAFS = data
          .filter((item: { filename: string }) =>
            item.filename.includes('_egrr')
          )
          .map((item: { filename: string }) => item.filename);

        // Filter items that contain 'xx' but not '_egrr'

        this.SIGW = data
          .filter(
            (item: { filename: string }) =>
              item.filename.includes('xx') && !item.filename.includes('_egrr')
          )
          .map((item: { filename: string }) => item.filename);
        console.log('SIGW:', this.SIGW);
        console.log('WAFS:', this.WAFS);

        this.isLoading = false;
      },
      (error) => {
        console.log('Error fetching JSON data:', error);
        this.isLoading = false;
      }
    );
  }

  selectOption(option: string, dropdown: string) {
    if (this.selectedOption) {
      this.selectedOption = option;
    }
  }
  selectOption2(option: string, dropdown: string) {
    if (this.selectedOption2) {
      this.selectedOption2 = option;
    }
  }
  selectOption3(option: string, dropdown: string) {
    if (this.selectedOption3) {
      this.selectedOption3 = option;
    }
  }
  selectOption4(option: string, dropdown: string) {
    if (this.selectedOption4) {
      this.selectedOption4 = option;
    }
  }

  getFilteredItemSouth() {
    let prefix = '';

    switch (this.selectedOption2) {
      case 'Africa':
        prefix = 'sigw_afxx';
        break;
      case 'Africa/Asia':
        prefix = 'sigw_aaxx';
        break;
      case 'Asia':
        prefix = 'sigw_fexx';
        break;
      case 'Australia':
        prefix = 'sigw_ssxx';
        break;
      case 'Europe':
        prefix = 'sigw_euxx';
        break;
      case 'Middle East':
        prefix = 'sigw_mexx';
        break;
      case 'North America':
        prefix = 'sigw_naxx';
        break;
      case 'South America':
        prefix = 'sigw_saxx';
        break;
      default:
        return this.SIGW; // Return the original array if no filter is applied
    }

    const pattern = new RegExp(`^${prefix}\\d+\\.png$`);
    return this.SIGW.filter((item: string) => pattern.test(item));
  }
  getFilteredItemChart() {
    let prefix = '';

    switch (this.selectedOption3) {
      case 'Africa':
        prefix = 'sigw_egrr_afxx';
        break;
      case 'Africa/Asia':
        prefix = 'sigw_egrr_aaxx';
        break;
      case 'Asia':
        prefix = 'sigw_egrr_fexx';
        break;
      case 'Australia':
        prefix = 'sigw_egrr_ssxx';
        break;
      case 'Europe':
        prefix = 'sigw_egrr_euxx';
        break;
      case 'Middle East':
        prefix = 'sigw_egrr_mexx';
        break;
      case 'North America':
        prefix = 'sigw_egrr_naxx';
        break;
      default:
        return this.WAFS; // Return the original array if no filter is applied
    }

    const pattern = new RegExp(`^${prefix}\\d+\\.png$`);
    return this.WAFS.filter((item: string) => pattern.test(item));
  }
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.closeAllDropdowns();
    }
  }

  toggleDropdown(dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.isDropdownOpen1 = !this.isDropdownOpen1;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen5 = false;
    }

    if (dropdown === 'dropdown2') {
      this.isDropdownOpen2 = !this.isDropdownOpen2;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen5 = false;
    }
    if (dropdown === 'dropdown3') {
      this.isDropdownOpen3 = !this.isDropdownOpen3;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen4 = false;
      this.isDropdownOpen5 = false;
    }

    if (dropdown === 'dropdown4') {
      this.isDropdownOpen4 = !this.isDropdownOpen4;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen5 = false;
    }
  }

  closeAllDropdowns() {
    this.isDropdownOpen1 = false;
    this.isDropdownOpen2 = false;
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  NavigateToInternational() {
    this.router.navigate(['/international']);
  }

  // ImageViewer(item: any) {
  //   console.log('file Name:', item);
  //   const folderName = 'sigw';
  //   const fileName = item;
  //   console.log('Folder Name:', folderName);
  //   this.isLoading = true;

  //   this.fetchSecondAPI(folderName, fileName)
  //     .then((filecontent) => {
  //       this.isLoading = false;

  //       const dialogConfig = new MatDialogConfig();
  //       dialogConfig.autoFocus = true;
  //       dialogConfig.disableClose = true;
  //       dialogConfig.width = '80%';
  //       dialogConfig.height = '80%';
  //       dialogConfig.data = { filecontent };

  //       const dialogRef = this.dialog.open(ImageViewrPage, dialogConfig);

  //       dialogRef.afterClosed().subscribe(() => {
  //         this.isLoading = false;
  //       });
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching file content:', error);
  //       this.isLoading = false;
  //     });
  // }

 






  ConvertImagesArray(ImageArray: any[]) {
    this.loading = true;
      // Clear the ImageArray
      this.ImageArray = [];
  
      console.log('IMAGE ARRAY:', ImageArray);
      
      if (ImageArray.length > 0) {
          // Fetch the first image's data
          this.APIService.GetAviationFile('sigw', ImageArray[0]).subscribe(
              (data) => {
                  console.log('IMAGE:', data);
                  const imageUrl = 'data:image/gif;base64,' + data.filecontent; // Adjust the MIME type accordingly
  
                  // Set the safe URL for the image
                  this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
                  
                  // Store the single image in the ImageArray
                  this.ImageArray.push(imageUrl);
  
                  // Present the modal with the single image
                  this.ImageViewer(this.ImageArray[0]); // Pass the single image URL
              },
              (error) => {
                  console.log('Error fetching JSON data:', error);
                  this.loading = false;
              }
          );
      }
  }
  
  async ImageViewer(img: SafeResourceUrl) {
      // Create and present a modal to view the image
      const modal = await this.moodalCtrl.create({
          component: ImageModalPage,
          componentProps: {
              imgs: img, // Pass the single image URL to the modal
          },
          cssClass: 'transparent-modal',
      });
      await modal.present();
  }
  
    ImagesArray(item: any, type: any[]) {
      console.log('ITYEM:', item, ' TYPE:', type);
      // let name = item.split('_')[0];
      // console.log('NAME:', name);
      let ImageArray = type.filter((x) => x.includes(item));
      console.log('Image arrays:', ImageArray);
      this.ConvertImagesArray(ImageArray);
    }
  
  
    openImageViewerSymbol(item: any) {
      console.log('File Name:', item);
      // Define the folder name
      const folderName = 'sigw';
      const fileName = item;
      console.log('Folder Name:', folderName);
      // Create the array to hold folderName and fileName
      const type = [
        { folderName: folderName, filename: fileName },
        // Add more entries if needed
      ];
      // Call the ImagesArray method with item and the type array
      this.ImagesArray(item, type);
    }
  













}
