import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cloud-cover',
  templateUrl: './cloud-cover.component.html',
  styleUrls: ['../../aero-sport/aero-sport.page.scss'],
})
export class CloudCoverComponent  implements OnInit {

  isLogged: boolean = false;
  frameArray: any = [];

  selectedOptionProduct: string = 'IR108_RSA';
  selectedOptionFrame: string = '';
  loading: boolean = false;

  isDropdownProductOpen: boolean = false;
  isDropdownFrameOpen: boolean = false;

  fileBaseUrl: SafeResourceUrl | undefined;
  currentIndex: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private APIService: APIService,
    private sanitizer: DomSanitizer

   ) { }

  ngOnInit() {

    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  cloudCoverDropdownProductOpen(){
    this.isDropdownProductOpen = !this.isDropdownProductOpen;
    this.isDropdownFrameOpen = false;
  }

  getCloudCoverImage(foldername: any, time: any, productname: any){
    this.APIService.GetSourceAviationFolderFilesList(foldername, time).subscribe(
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

  cloudCoverDropdownFrameOpen(){
    this.isDropdownFrameOpen = !this.isDropdownFrameOpen;
  }

  selectDropdownProduct(selectOption: string, dropdown: string) {
    if (dropdown === 'dropdown1') {
      this.selectedOptionProduct = selectOption;
      this.getCloudCoverImage('', 12, selectOption);
    }

    if (dropdown === 'dropdown2') {
      this.selectedOptionProduct = selectOption;
      this.getCloudCoverImage('', 12, selectOption);
    }
    
    if (dropdown === 'dropdown3') {
      this.selectedOptionProduct = selectOption;
      this.getCloudCoverImage('', 12, selectOption);
    
    }
    if (dropdown === 'dropdown4') {
      this.selectedOptionProduct = selectOption;
      this.getCloudCoverImage('', 12, selectOption);
    
    }
}

selectDropdownFrame(selectOption: string, imagefilename: string ) {

  this.selectedOptionFrame = selectOption;

  this.displayImage('', imagefilename).then((filetextcontent) => {
      const imageUrlNext = 'data:image/gif;base64,' + filetextcontent;
      this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlNext);
  });

}

  aeroSportPageNavigation() {
    this.router.navigate(['/aero-sport']);
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
