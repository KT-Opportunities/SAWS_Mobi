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
  selector: 'app-humidity',
  templateUrl: './humidity.component.html',
  styleUrls: ['./../international.page.scss'],
})
export class HumidityComponent implements OnInit {
  isLogged: boolean = false;
  isLoading: boolean = false;

  isCloudForecast: boolean = false;
  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  isDropdownOpen4: boolean = false;

  //selectedOption1: string = 'Low';
  selectedOption = 'FL050';
  selectedOption2 = 'FL050';
  selectedOption3 = 'FL050';
  selectedOption4 = 'FL050';

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
    const baseName = imageName.split('.png')[0];

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
    this.APIService.GetSourceAviationFolderFilesList('rh').subscribe(
      (data) => {
        console.log('Data received:', data);
        this.GridWind = data;
        console.log('RH:', this.GridWind);
        this.CentralGridWindArray = this.GridWind.filter(
          (item: { filename: string }) => item.filename.includes('rh_cent')
        ).map((item: { filename: string }) => item.filename);
        console.log('CentralGridWindArray:', this.CentralGridWindArray);

        this.WestGridWindArray = this.GridWind.filter(
          (item: { filename: string }) => item.filename.includes('rh_west')
        ).map((item: { filename: string }) => item.filename);
        console.log('WestGridWindArray:', this.WestGridWindArray);

        this.EastGridWindArray = this.GridWind.filter(
          (item: { filename: string }) => item.filename.includes('rh_east')
        ).map((item: { filename: string }) => item.filename);
        console.log('EastGridWindArray:', this.EastGridWindArray);

        this.SouthGridWindArray = this.GridWind.filter(
          (item: { filename: string }) => item.filename.includes('rh_south')
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
    if (this.selectedOption2 === 'FL050') {
      return this.CentralGridWindArray.filter((item: any) => {
        const pattern = /rh_cent050\d{2}\.png/;
        return pattern.test(item);
      });
    } else if (this.selectedOption2 === 'FL100') {
      return this.CentralGridWindArray.filter((item: any) => {
        const pattern = /rh_cent100\d{2}\.png/;
        return pattern.test(item);
      });
    } else if (this.selectedOption2 === 'FL140') {
      return this.CentralGridWindArray.filter((item: any) => {
        const pattern = /rh_cent140\d{2}\.png/;
        return pattern.test(item);
      });
    } else if (this.selectedOption2 === 'FL180') {
      return this.CentralGridWindArray.filter((item: any) => {
        const pattern = /rh_cent180\d{2}\.png/;
        return pattern.test(item);
      });
    } else {
      return this.CentralGridWindArray;
    }
  }

  getFilteredItemWest() {
    if (this.selectedOption3 === 'FL050') {
      return this.WestGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /rh_west05\d+\.png/;
        return pattern.test(item);
      });
    } else if (this.selectedOption3 === 'FL100') {
      return this.WestGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /rh_west10\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption3 === 'FL140') {
      return this.WestGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /rh_west14\d+\.gif/;
        return pattern.test(item);
      });
    } else if (this.selectedOption3 === 'FL180') {
      return this.WestGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /rh_west18\d+\.gif/;
        return pattern.test(item);
      });
    } else {
      return this.WestGridWindArray;
    }
  }
  getFilteredItemEast() {
    if (this.selectedOption4 === 'FL050') {
      return this.EastGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /rh_east05\d+\.png/;
        return pattern.test(item);
      });
    } else if (this.selectedOption4 === 'FL100') {
      return this.EastGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /rh_east10\d+\.png/;
        return pattern.test(item);
      });
    } else if (this.selectedOption4 === 'FL140') {
      return this.EastGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /rh_east14\d+\.png/;
        return pattern.test(item);
      });
    } else if (this.selectedOption4 === 'FL180') {
      return this.EastGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /rh_east18\d+\.png/;
        return pattern.test(item);
      });
    }
    {
      return this.EastGridWindArray;
    }
  }
  getFilteredItemSouth() {
    if (this.selectedOption === 'FL050') {
      return this.SouthGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /rh_south05\d+\.png/;
        return pattern.test(item);
      });
    } else if (this.selectedOption === 'FL100') {
      return this.SouthGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /rh_south10\d+\.png/;
        return pattern.test(item);
      });
    } else if (this.selectedOption === 'FL140') {
      return this.SouthGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /rh_south14\d+\.png/;
        return pattern.test(item);
      });
    } else if (this.selectedOption === 'FL180') {
      return this.SouthGridWindArray.filter((item: any) => {
        // Use a regular expression to match the pattern "gw_cent10\d+\.gif"
        const pattern = /rh_south18\d+\.png/;
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
    }

    if (dropdown === 'dropdown2') {
      this.isDropdownOpen2 = !this.isDropdownOpen2;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen4 = false;
    }
    if (dropdown === 'dropdown3') {
      this.isDropdownOpen3 = !this.isDropdownOpen3;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen2 = false;
      this.isDropdownOpen4 = false;
    }

    if (dropdown === 'dropdown4') {
      this.isDropdownOpen4 = !this.isDropdownOpen4;
      this.isDropdownOpen1 = false;
      this.isDropdownOpen3 = false;
      this.isDropdownOpen2 = false;
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

  
  ImageViewer(item: any) {
    const folderName = item.substring(0, 2);
    const fileName = item;
    this.isLoading = true;

    this.fetchSecondAPI(folderName, fileName)
      .then((filecontent) => {
        this.isLoading = false;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = '80%';
        dialogConfig.height = '80%';
        dialogConfig.data = { filecontent };

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

  fetchSecondAPI(folderName: string, fileName: string): Promise<string> {
    // Return a promise that resolves with filecontent
    return new Promise<string>((resolve, reject) => {
      this.APIService.GetAviationFile(folderName, fileName).subscribe(
        (response) => {
          // Assuming filecontent is obtained from the response
          const filecontent = response.filecontent;
          // Log filecontent to verify
          console.log('File Text Content:', filecontent);
          // Resolve the promise with filecontent
          resolve(filecontent);
        },
        (error) => {
          // Reject the promise if there's an error
          reject(error);
        }
      );
    });
  }
}
