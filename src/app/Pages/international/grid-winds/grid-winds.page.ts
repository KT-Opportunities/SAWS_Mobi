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
  selector: 'app-grid-winds',
  templateUrl: './grid-winds.page.html',
  styleUrls: ['./../international.page.scss'],
})
export class GridWindsPage implements OnInit {
  isLogged: boolean = false;
  isLoading: boolean = false;
  loading: boolean = false;
  // loading: boolean = false;
  isCloudForecast: boolean = false;
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  isDropdownOpen4: boolean = false;
  isDropdownOpen5: boolean = false;
  //selectedOption1: string = 'Low';
  selectedOption = 'FL100';
  selectedOption2: string = 'FL100';
  selectedOption3: string = 'FL100';
  selectedOption4: string = 'FL100';
  selectedOption5: string = 'FL100';

  GridWind: any = [];
  CentralGridWindArray: any = [];
  WestGridWindArray: any = [];
  EastGridWindArray: any = [];
  SouthGridWindArray: any = [];
  ImageArray: any = [];
  fileBaseUrl: SafeResourceUrl;
  // fileBaseUrlPrevious: SafeResourceUrl;
  // fileBaseUrlSynoptic: SafeResourceUrl;

  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,

    private http: HttpClient,
    private moodalCtrl: ModalController,
    private APIService: APIService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
   
   
  }
  getTimeFromFilename(imageName: any) {
    // Extract the portion before '.gif'
    const baseName = imageName.split('.gif')[0];

    // Extract the last two characters
    const time = baseName.slice(-2);

    // Return the formatted time or 'outlook'
    return `${time}:00`;
  }

  ngOnInit() {
    // Check if user is logged in
    // this.isLoading = true;

    if (!this.authService.getIsLoggedIn()) {
      // If not logged in, navigate to the login page
      this.router.navigate(['/login']);
    }
    this.APIService.GetSourceAviationFolderFilesList('gw').subscribe(
      (data) => {
        console.log('Data received:', data);
        this.GridWind = data;
        console.log('PW:', this.GridWind);
        this.CentralGridWindArray = this.GridWind.filter(
          (item: { filename: string }) => item.filename.includes('gw_cent')
        ).map((item: { filename: string }) => item.filename);
        console.log('CentralGridWindArray:', this.CentralGridWindArray);

        this.WestGridWindArray = this.GridWind.filter(
          (item: { filename: string }) => item.filename.includes('gw_west')
        ).map((item: { filename: string }) => item.filename);
        console.log('WestGridWindArray:', this.WestGridWindArray);

        this.EastGridWindArray = this.GridWind.filter(
          (item: { filename: string }) => item.filename.includes('gw_east')
        ).map((item: { filename: string }) => item.filename);
        console.log('EastGridWindArray:', this.EastGridWindArray);

        this.SouthGridWindArray = this.GridWind.filter(
          (item: { filename: string }) => item.filename.includes('gw_south')
        ).map((item: { filename: string }) => item.filename);
        console.log('SouthGridWindArray:', this.SouthGridWindArray);

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

  getFilteredItemCentral() {
    if (this.selectedOption2 === 'FL100') {
      return this.CentralGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_cent10\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption2 === 'FL180') {
      return this.CentralGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_cent18\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption2 === 'FL240') {
      return this.CentralGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_cent24\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption2 === 'FL300') {
      return this.CentralGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_cent30\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption2 === 'FL340') {
      return this.CentralGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_cent34\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption2 === 'FL390') {
      return this.CentralGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_cent39\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption2 === 'FL450') {
      return this.CentralGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_cent45\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption2 === 'FL530') {
      return this.CentralGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_cent53\d+\.gif/;
        return pattern.test(item);
      });
    } else {
      return this.CentralGridWindArray;
    }
  }
  getFilteredItemWest() {
    if (this.selectedOption3 === 'FL100') {
      return this.WestGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_west10\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption3 === 'FL180') {
      return this.WestGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_west18\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption3 === 'FL240') {
      return this.WestGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_west24\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption3 === 'FL300') {
      return this.WestGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_west30\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption3 === 'FL340') {
      return this.WestGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_west34\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption3 === 'FL390') {
      return this.WestGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_west39\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption3 === 'FL450') {
      return this.WestGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_west45\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption2 === 'FL530') {
      return this.WestGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_west53\d+\.gif/;
        return pattern.test(item);
      });
    } else {
      return this.WestGridWindArray;
    }
  }
  getFilteredItemEast() {
    if (this.selectedOption4 === 'FL100') {
      return this.EastGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_east10\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption4 === 'FL180') {
      return this.EastGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_east18\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption4 === 'FL240') {
      return this.EastGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_east24\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption4 === 'FL300') {
      return this.EastGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_east30\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption4 === 'FL340') {
      return this.EastGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_east34\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption4 === 'FL390') {
      return this.EastGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_east39\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption4 === 'FL450') {
      return this.EastGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_east45\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption4 === 'FL530') {
      return this.EastGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_east53\d+\.gif/;
        return pattern.test(item);
      });
    } else {
      return this.EastGridWindArray;
    }
  }

  getFilteredItemSouth() {
    if (this.selectedOption === 'FL100') {
      return this.SouthGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_south10\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption === 'FL180') {
      return this.SouthGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_south18\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption === 'FL240') {
      return this.SouthGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_south24\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption === 'FL300') {
      return this.SouthGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_south30\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption === 'FL340') {
      return this.SouthGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_south34\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption === 'FL390') {
      return this.SouthGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_south39\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption === 'FL450') {
      return this.SouthGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_south45\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption === 'FL530') {
      return this.SouthGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /gw_south53\d+\.gif/;
        return pattern.test(item);
      });
    } else {
      return this.SouthGridWindArray;
    }
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



 

  ConvertImagesArray(ImageArray: any[]) {
    this.loading = true;
      // Clear the ImageArray
      this.ImageArray = [];
  
      console.log('IMAGE ARRAY:', ImageArray);
      
      if (ImageArray.length > 0) {
          // Fetch the first image's data
          this.APIService.GetAviationFile('gw', ImageArray[0]).subscribe(
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
      modal.onWillDismiss().then(() => {
        this.loading = false; // Stop loading when the modal is closed
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
      const folderName = 'gw';
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
