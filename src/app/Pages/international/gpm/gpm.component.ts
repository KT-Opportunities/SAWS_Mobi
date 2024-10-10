import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from '../../image-modal/image-modal.page';

@Component({
  selector: 'app-gpm',
  templateUrl: './gpm.component.html',
  styleUrls: ['./../international.page.scss'],
})
export class GpmComponent implements OnInit {

  isLogged: boolean = false; // Indicates if the user is logged in
  frameArray: any = []; // Array to hold frame data
  ImageArray: any = []; // Array to hold images
  fileBaseUrl: SafeResourceUrl | undefined; // Safe URL for image display
  loading: boolean = false; // Loading state for image fetching

  selectedOption: string = 'West'; // Default selected option for dropdown
  selectedOptionFilename: string = 'gw_west'; // Filename prefix based on the selected option
  isDropdownOpen: boolean = false; // State for managing dropdown visibility
  folderName: string = 'gw'; // Folder name for image fetching
  lastModifiedHours: number = 12; // Time to filter recent images

  constructor(
    private router: Router,
    private authService: AuthService,
    private APIService: APIService,
    private sanitizer: DomSanitizer,
    private moodalCtrl: ModalController
  ) { }

  ngOnInit() {
    // Initializing the component, set up any necessary state here
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  get isLoggedIn(): boolean {
    // Check if user is logged in through AuthService
    return this.authService.getIsLoggedIn();
  }

  NavigateToInternational() {
    // Navigate to the international page
    this.router.navigate(['/international']);
  }

  gpmDropdownOpen() {
    // Toggle dropdown visibility
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string, dropdown: string, selectedOption: string) {
    // Set selected option based on the dropdown type
    this.selectedOption = selectedOption;
    this.selectedOptionFilename = option;
  }

  viewImage(imageFilename: string) {
    this.loading = true; // Set loading state to true

    // Construct the filename using the selected option and provided filename
    const filename = this.selectedOptionFilename + imageFilename;

    // Fetch the image from the API
    this.APIService.GetAviationFile(this.folderName, filename).subscribe(
      (response) => {
        const fileContent = response.filecontent; // Get the file content from the response
        console.log('File content received:', fileContent); // Log the file content

        // Check if file content exists
        if (fileContent) {
          // Create a base64 image URL from the file content
          const imageUrl = 'data:image/gif;base64,' + fileContent; // Ensure the format is correct for your image
          console.log('Image URL:', imageUrl); // Log the constructed image URL

          // Sanitize the image URL for safe use in the application
          this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);

          // Check if the fileBaseUrl is defined
          if (this.fileBaseUrl) {
            setTimeout(() => {
              // Open the image viewer modal with the sanitized image URL
              this.openImageViewer(this.fileBaseUrl!); // Using '!' to assert it's not undefined
            }, 1000); // Optional delay to simulate loading
          }
        } else {
          console.error('No valid image data found.');
        }

        // Set loading state to false after processing
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching the image:', error);
        this.loading = false; // Set loading state to false on error
      }
    );
  }

  async openImageViewer(imgs: SafeResourceUrl) {
    // Create and present a modal to view the image
    const modal = await this.moodalCtrl.create({
      component: ImageModalPage,
      componentProps: {
        imgs, // Pass the image URL to the modal
      },
      cssClass: 'transparent-modal',
    });
    await modal.present();
  }
}
