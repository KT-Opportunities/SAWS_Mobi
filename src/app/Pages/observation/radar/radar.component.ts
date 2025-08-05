import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageViewrPage } from '../../image-viewr/image-viewr.page';
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from '../../image-modal/image-modal.page';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss'],
})
export class RadarComponent implements OnInit {
  isLogged: boolean = false;
  loading: boolean = false;
  imageNotFound: boolean = false;

  frameArray: any = [];
  fileBaseUrl: SafeResourceUrl | undefined;

  selectedOption: string = 'Individual image';
  selectedOptionFilename: string = '.gif';
  isDropdownOpen: boolean = false;
  folderName: string = 'radar';
  lastModifiedHours: number = 12;
  ImageinfoArray: any = [];

  ImageArray: any = []; // Array to hold images
  constructor(
    private router: Router,
    private authService: AuthService,
    private APIService: APIService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private moodalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  navigateToObservation() {
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

  viewImage(imageFilename: string) {
    const filename = imageFilename + this.selectedOptionFilename;
    const foldername = this.folderName; // Assuming folderName is already defined
    // Create an object with foldername and filename
    const imageInfo = { foldername, filename };

    // Initialize the array if it's not already initialized
    if (!this.ImageinfoArray) {
      this.ImageinfoArray = [];
    }

    // Push the image information into the array
    this.ImageinfoArray.push(imageInfo);
    console.log('Image info array:', this.ImageinfoArray);

    // Call the method to handle the array (you likely want to pass the whole array, not just the push result)
    this.ImagesArray(filename, this.ImageinfoArray);
  }

  ImagesArray(item: any, type: any[]) {
    console.log('ITEM:', item, ' TYPE:', type);

    // Filter to get the image info corresponding to the selected filename
    let ImageArray = type.filter((x) => x.filename.includes(item));
    console.log('Filtered image array:', ImageArray);

    // Pass only the first matching image to ConvertImagesArray
    if (ImageArray.length > 0) {
      this.ConvertImagesArray([ImageArray[0]]);
    }
  }

  ConvertImagesArray(ImageArray: any[]) {
    // Clear the ImageArray
    this.ImageArray = [];
     this.loading = true;
    console.log('IMAGE ARRAY:', ImageArray);

    if (ImageArray.length > 0) {
      // Fetch the first image's data
      this.APIService.GetAviationFile(this.folderName, ImageArray[0].filename).subscribe(
        (data) => {
          console.log('IMAGE:', data);
          const imageUrl = 'data:image/gif;base64,' + data.filecontent; // Adjust the MIME type accordingly

          // Set the safe URL for the image
          this.fileBaseUrl =
            this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);

          // Store the single image in the ImageArray
          this.ImageArray.push(imageUrl);
          this.loading = false; 
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
}
