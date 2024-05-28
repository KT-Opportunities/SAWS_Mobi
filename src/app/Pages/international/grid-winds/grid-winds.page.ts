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

@Component({
  selector: 'app-grid-winds',
  templateUrl: './grid-winds.page.html',
  styleUrls: ['./../international.page.scss'],
})
export class GridWindsPage implements OnInit {
  isLogged: boolean = false;
  isLoading: boolean = true;

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
    private sanitizer: DomSanitizer
  ) {
    this.fileBaseUrlNext = this.sanitizer.bypassSecurityTrustResourceUrl('');
    this.fileBaseUrlPrevious =
      this.sanitizer.bypassSecurityTrustResourceUrl('');
    this.fileBaseUrlSynoptic =
      this.sanitizer.bypassSecurityTrustResourceUrl('');
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
    this.APIService.GetSourceAviationFolderFilesList('gw', 72).subscribe(
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

  aerosportPage() {
    this.router.navigate(['/aero-sport']);
    window.history.back();
  }

  ImageViewer(item: any) {
    console.log('file Name:', item);
    const folderName = item.substring(0, 2);
    const fileName = item;
    debugger;
    console.log('Folder Name:', folderName);

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
      this.APIService.GetAviationFile(folderName, fileName).subscribe(
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
}
