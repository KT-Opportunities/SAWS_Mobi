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
  selector: 'app-grid-maximum',
  templateUrl: './grid-maximum.page.html',
  styleUrls: ['./../international.page.scss'],
})
export class GridMaximumPage implements OnInit {
  isLogged: boolean = false;
  isLoading: boolean = false;
  loading: boolean = false;
  fileBaseUrl: SafeResourceUrl | undefined;
  MaximumArray: any = [];
  ImageArray: any = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,

    private http: HttpClient,

    private APIService: APIService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private moodalCtrl: ModalController
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
    this.loading = true;

    this.APIService.GetSourceAviationFolderFilesList('mxw').subscribe(
      (response) => {
        this.MaximumArray = response;
        console.log('Response:', this.MaximumArray);

        this.MaximumArray = response.filter((item: any) =>
          item.filename.includes('mxw_EURAFI-AREA')
        );
        console.log('Response after filter:', this.MaximumArray);

        console.log('Response:', this.MaximumArray);

        this.isLoading = false; // Set loading to false after processing
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.loading = false; // Set loading to false in case of error
        // Handle error appropriately (e.g., show error message)
      }
    );
  }


  ConvertImagesArray(ImageArray: any[]) {
    this.loading = true;
    // Clear the ImageArray
    this.ImageArray = [];

    console.log('IMAGE ARRAY:', ImageArray);

    if (ImageArray.length > 0) {
      // Fetch the first image's data
      this.APIService.GetAviationFile(
        ImageArray[0].foldername,
        ImageArray[0].filename
      ).subscribe(
        (data) => {
          console.log('IMAGE:', data);
          const imageUrl = 'data:image/gif;base64,' + data.filecontent; // Adjust the MIME type accordingly

          // Set the safe URL for the image
          this.fileBaseUrl =
            this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);

          // Store the single image in the ImageArray
          this.ImageArray.push(imageUrl);

          // Present the modal with the single image
          this.ImageViewer(this.ImageArray[0]); // Pass the single image URL
          this.loading = false;
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
    console.log('ITEM:', item, ' TYPE:', type);

    // Assuming 'item' is a part of the filename you want to match
    let ImageArray = type.filter((x) => x.filename.includes(item.filename));

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

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  NavigateToInternational() {
    this.router.navigate(['/international']);
  }
}
