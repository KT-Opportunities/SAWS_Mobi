import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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

  fileBaseUrl: SafeResourceUrl | undefined;
  currentIndex: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private APIService: APIService,
    private sanitizer: DomSanitizer

   ) { }

  ngOnInit() {
    this.getSatelliteImage('', 12, this.selectedOptionProduct);
    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  sateliteDropdownProductOpen(){
    this.isDropdownProductOpen = !this.isDropdownProductOpen;
    this.isDropdownFrameOpen = false;
  }

  getSatelliteImage(foldername: any, time: any, productname: any){
    this.APIService.GetSourceAviationFolderFilesList(foldername, 6).subscribe(
      (response) => {
        this.frameArray = response;

        this.frameArray = response.filter((item: any) =>
          item.filename.includes(productname)
        );

        if (this.frameArray.length > 0) {
            this.selectedOptionFrame = this.frameArray[0].lastmodified;
    
            this.displayImage('', this.frameArray[0].filename).then((filetextcontent) => {
              const imageUrlNext = 'data:image/gif;base64,' + filetextcontent;
              this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlNext);
          });
        }    

        this.loading = false;
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.loading = false;
      }
    );
  }

  displayImage(imagefoldername: string, imagefilename: string): Promise<string> {
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
          const imageUrlNext = 'data:image/gif;base64,' + filetextcontent;
          this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlNext);
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

  previousImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.frameArray.length) % this.frameArray.length;

    this.selectedOptionFrame = this.frameArray[this.currentIndex].lastmodified; 
    const fileName = this.frameArray[this.currentIndex].filename;
    this.displayImage('', fileName).then((filetextcontent) => {
        const imageUrlNext = 'data:image/gif;base64,' + filetextcontent;
        this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlNext);
    });
    
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.frameArray.length;

    this.selectedOptionFrame = this.frameArray[this.currentIndex].lastmodified;    
    const fileName = this.frameArray[this.currentIndex].filename;

    this.displayImage('', fileName).then((filetextcontent) => {
        const imageUrlNext = 'data:image/gif;base64,' + filetextcontent;
        this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlNext);
    });
  }
}