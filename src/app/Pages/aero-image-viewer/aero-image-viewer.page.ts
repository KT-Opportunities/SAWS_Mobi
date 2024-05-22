import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';

@Component({
  selector: 'app-aero-image-viewer',
  templateUrl: './aero-image-viewer.page.html',
  styleUrls: ['./aero-image-viewer.page.scss'],
})
export class AeroImageViewerPage implements OnInit {
  nextday: boolean = true;
  prevday: boolean = false;
  TsProbability: any = [];
  isLoading: boolean = false;
  imageUrls: { [filename: string]: SafeUrl } = {};
  fileBaseUrlNext: SafeResourceUrl;
  fileBaseUrlPrevious: SafeResourceUrl;
  name: string = '';
  anotherName: string = '';
  displayName: string = '';
  kwazulNatal: string = '';
  filenameToDisplayName: { [key: string]: string } = {
    'xl-25.8327.75_spot_d1.gif': 'Haartebeesspoort',
    'xl-25.2527.0_spot_d1.gif': 'Pilanesberg',
    'xl-25.7328.18_spot_d1.gif': 'Pretoria',
    'xl-28.40229.373_spot_d1.gif': 'Van Reenen',
    'xl-27.99824.749_spot_d1.gif': 'Jan Kempdorp ',
    'xl-26.3528.46_spot_d1.gif': 'Dunnottar',
    'xl-24.3531.00_spot_d1.gif': 'Hoeadspruid',
    'xl-25.53327.775_spot_d1.gif': 'Brits A/F',
    'xl-26.038827.587_spot_d1.gif': 'Orient',
  };

  constructor(
    private router: Router,
    private elRef: ElementRef,
    private http: HttpClient,
    private APIService: APIService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    this.fileBaseUrlNext = this.sanitizer.bypassSecurityTrustResourceUrl('');
    this.fileBaseUrlPrevious =
      this.sanitizer.bypassSecurityTrustResourceUrl('');
  }
  extractAlphabetical(filename: string): string {
    return filename.replace(/[^a-zA-Z]/g, '');
  }
  ngOnInit() {
    this.name = history.state.names || '';
    this.anotherName = history.state.names2 || '';
    this.displayName = history.state.names2 || '';
    this.kwazulNatal = history.state.kwazulNatal || '';
    console.log('ANOTHER:', this.kwazulNatal);

    if (this.anotherName.includes('_spot_d1')) {
      this.anotherName = this.anotherName.split('_spot_d1')[0];
    } else if (this.anotherName.includes('_spot_d2')) {
      this.anotherName = this.anotherName.split('_spot_d2')[0];
    }else if(this.kwazulNatal.includes('_d1.gif')){
      this.kwazulNatal = this.kwazulNatal.split('_d1.gif')[0];
    }
    else if(this.kwazulNatal.includes('_d2.gif')){
      this.kwazulNatal = this.kwazulNatal.split('_d2.gif')[0];
    }
    console.log('ANOTHER:', this.anotherName);

    this.isLoading = true;
    this.APIService.GetSourceAviationFolderFilesList('aerosport', 24).subscribe(
      (data) => {
        try {
          console.log('Fetched Data:', data);
          if (this.name) {
            this.TsProbability = data.filter(
              (item: any) =>
                item.filename === 'xl' + this.name + '_spot_d1.gif' ||
                item.filename === 'xl' + this.name + '_spot_d2.gif'
            );
          } else if (this.anotherName) {
            this.TsProbability = data.filter(
              (item: any) =>
                item.filename === this.anotherName + '_spot_d1.gif' ||
                item.filename === this.anotherName + '_spot_d2.gif'
            );
          } else if (this.kwazulNatal) {
            this.TsProbability = data.filter(
              (item: any) =>
                item.filename === this.kwazulNatal + '_d1.gif' ||
                item.filename === this.kwazulNatal + '_d2.gif'
            );
          }

          console.log('Filtered TsProbability:', this.TsProbability);
          this.previousDay();
          this.nextDay(); // Ensure both functions are called after data is filtered
          this.isLoading = false;
        } catch (error) {
          console.log('Error parsing JSON data:', error);
          this.isLoading = false;
        }
      },
      (error) => {
        console.log('Error fetching JSON data:', error);
        this.isLoading = false;
      }
    );
  }

  fetchSecondAPI(folderName: string, fileName: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.APIService.GetAviationFile(folderName, fileName).subscribe(
        (response) => {
          const filetextcontent = response.filetextcontent;
          console.log('Fetched file content:', filetextcontent);
          resolve(filetextcontent);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  previousDay() {
    if (this.TsProbability.length > 0) {
      this.nextday = false;
      this.prevday = true;
      console.log('ARRAY AT 0:', this.TsProbability[0]);
      this.APIService.GetAviationFile(
        this.TsProbability[0].foldername,
        this.TsProbability[0].filename
      ).subscribe(
        (data) => {
          console.log('IMAGE:', data);
          const imageUrlPrevious =
            'data:image/gif;base64,' + data.filetextcontent;
          this.fileBaseUrlPrevious =
            this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlPrevious);
          console.log('back to image:', this.fileBaseUrlPrevious);
        },
        (error) => {
          console.log('Error fetching previous day image:', error);
          this.isLoading = false;
        }
      );
    } else {
      console.log('No data available for previous day.');
    }
  }

  nextDay() {
    if (this.TsProbability.length > 1) {
      this.nextday = true;
      this.prevday = false;
      console.log('ARRAY AT 1:', this.TsProbability[1]);
      this.APIService.GetAviationFile(
        this.TsProbability[1].foldername,
        this.TsProbability[1].filename
      ).subscribe(
        (data) => {
          console.log('IMAGE:', data);
          const imageUrlNext = 'data:image/gif;base64,' + data.filetextcontent;
          this.fileBaseUrlNext =
            this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlNext);
          console.log('back to image:', this.fileBaseUrlNext);
        },
        (error) => {
          console.log('Error fetching next day image:', error);
          this.isLoading = false;
        }
      );
    } else {
      console.log('No data available for next day.');
    }
  }

  Aerosport() {
    window.history.back();
  }
}
