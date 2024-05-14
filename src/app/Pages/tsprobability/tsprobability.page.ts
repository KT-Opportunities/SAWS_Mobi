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
  selector: 'app-tsprobability',
  templateUrl: './tsprobability.page.html',
  styleUrls: ['./tsprobability.page.scss'],
})
export class TSProbabilityPage implements OnInit {
  nextday: boolean = true;
  prevday: boolean = false;
  TsProbability: any = [];
  isLoading: boolean = false;
  imageUrls: { [filename: string]: SafeUrl } = {};
  fileBaseUrlNext: SafeResourceUrl;
  fileBaseUrlPrevious: SafeResourceUrl;
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

  ngOnInit() {
    this.isLoading = true;
    this.APIService.GetSourceAviationFolderFilesList('aerosport', 24).subscribe(
      (data) => {
        try {
          this.TsProbability = data.filter(
            (item: any) =>
              item.filename === 'tsprob_d1.gif' ||
              item.filename === 'tsprob_d2.gif'
          );

          console.log('DATA2:', this.TsProbability);

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
          console.log('DATA2:', this.TsProbability);

          resolve(filetextcontent);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  previousDay() {
    // Add logic for navigating to the previous day
    this.TsProbability[0];
    this.APIService.GetAviationFile(
      this.TsProbability[0].foldername,
      this.TsProbability[0].filename
    ).subscribe(
      (data) => {
        const imageUrlPrevious =
          'data:image/jpeg/gif;base64,' + data.filetextcontent; // Adjust the MIME type accordingly
        this.fileBaseUrlPrevious =
          this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlPrevious);

        console.log('back to image:', this.fileBaseUrlPrevious);
      },
      (error) => {
        console.log('Error fetching JSON data:', error);
        this.isLoading = false;
      }
    );
  }

  nextDay() {
    this.TsProbability[1];
    this.APIService.GetAviationFile(
      this.TsProbability[1].foldername,
      this.TsProbability[1].filename
    ).subscribe(
      (data) => {
        const imageUrlNext =
          'data:image/jpeg/gif;base64,' + data.filetextcontent; // Adjust the MIME type accordingly
        this.fileBaseUrlNext =
          this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlNext);

        console.log('back to image:', this.fileBaseUrlNext);
      },
      (error) => {
        console.log('Error fetching JSON data:', error);
        this.isLoading = false;
      }
    );
  }
}
