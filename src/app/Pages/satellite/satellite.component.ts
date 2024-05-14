import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-satellite',
  templateUrl: './satellite.component.html',
  styleUrls: ['../../observation/observation.page.scss'],
})
export class SatelliteComponent  implements OnInit {

  isLogged: boolean = false;
  frameArray: any = [];

  isDropdownProductOpen: boolean = false;
  isDropdownFrameOpen: boolean = false;

  selectedOptionProduct: string = 'IR108_RSA';
  selectedOptionFrame: string = '';
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private APIService: APIService,

   ) { }

  ngOnInit() {
    this.getSatelliteImage('', 12, this.selectedOptionProduct);
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  // selectOption(option: string, dropdown: string) {
  //   if (dropdown === 'dropdown1') {
  //     this.selectedOption1 = option;
  //     this.isDropdownOpen1 = false;
  //   } 
  //   if (dropdown === 'dropdown2') {
  //     this.selectedOption2 = option;
  //     this.isDropdownOpen2 = false;
  //   }
  //   if (dropdown === 'dropdown3') {
  //     this.selectedOption3 = option;
  //     this.isDropdownOpen2 = false;
  //   }
    
  // }

  sateliteDropdownProductOpen(){
    this.isDropdownProductOpen = !this.isDropdownProductOpen;
    this.isDropdownFrameOpen = false;
  }

  getSatelliteImage(foldername: any, time: any, productname: any){
    this.APIService.GetSourceAviationFolderFilesList(foldername, time).subscribe(
      (response) => {
        this.frameArray = response;

        this.frameArray = response.filter((item: any) =>
          item.filename.includes(productname)
        );

        this.selectedOptionFrame = this.frameArray[0].lastmodified;

        console.log('Response:', this.frameArray);       

        this.loading = false;
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.loading = false;
      }
    );
  }

  displayImage(imagefoldername: string, imagefilename: string): Promise<string> {
    // Return a promise that resolves with filetextcontent
    return new Promise<string>((resolve, reject) => {
      this.APIService.GetAviationFile(imagefoldername, imagefilename).subscribe(
        (response) => {
          const filetextcontent = response.filetextcontent;
          resolve(filetextcontent);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  sateliteDropdownFrameOpen(){
    this.isDropdownFrameOpen = !this.isDropdownFrameOpen;
  }

  selectDropdownProduct(selectOption: string, dropdown: string) {
      if (dropdown === 'dropdown1') {
        this.selectedOptionProduct = selectOption;
        this.getSatelliteImage('', 12, selectOption);
      }

      if (dropdown === 'dropdown2') {
        this.selectedOptionProduct = selectOption;
        this.getSatelliteImage('', 12, selectOption);
      }
      
      if (dropdown === 'dropdown3') {
        this.selectedOptionProduct = selectOption;
        this.getSatelliteImage('', 12, selectOption);
      
      }
      if (dropdown === 'dropdown4') {
        this.selectedOptionProduct = selectOption;
        this.getSatelliteImage('', 12, selectOption);
      
      }
      if (dropdown === 'dropdown5') {
        this.selectedOptionProduct = selectOption;
        this.getSatelliteImage('', 12, selectOption);
      }
  }

  selectDropdownFrame(selectOption: string, imagefilename: string ) {

      this.selectedOptionFrame = selectOption;

      this.displayImage('', imagefilename).then((filetextcontent) => {
        // // Once filetextcontent is retrieved, open the dialog with necessary data
        // const dialogConfig = new MatDialogConfig();
        // dialogConfig.autoFocus = true;
        // dialogConfig.disableClose = true;
        // dialogConfig.width = '80%'; // Set custom width
        // dialogConfig.height = '80%'; // Set custom height
        // dialogConfig.data = {
        //   filetextcontent: filetextcontent,
        //   // Add any additional data you want to pass to the dialog here
        // };
  
        // const dialogRef = this.dialog.open(ImageViewrPage, dialogConfig);

        console.log('filetextcontent', filetextcontent)
      });

  }

  observationPageNavigation() {
    this.router.navigate(['/observation']);
  }

  formatTimestamp(timestamp: string): string {
   
    let date: Date;
    if (timestamp === '') {
      date = new Date(Date.now());
    } else {
      date = new Date(timestamp);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

}
