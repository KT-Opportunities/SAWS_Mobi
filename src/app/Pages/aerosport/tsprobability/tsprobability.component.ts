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
  templateUrl: './tsprobability.component.html',
  styleUrls: ['./../aero-sport.page.scss'],
})
export class TSProbabilityComponent implements OnInit {
  currentImageIndex: number = 0;
  TsProbability: any = [];
  isLoading: boolean = false;
  fileBaseUrlNext: SafeResourceUrl;
  fileBaseUrlPrevious: SafeResourceUrl;
  prevday: boolean = false; // Define prevday property
  nextday: boolean = true; // Define nextday property

  constructor(
    private router: Router,
    private elRef: ElementRef,
    private http: HttpClient,
    private APIService: APIService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    this.fileBaseUrlNext = this.sanitizer.bypassSecurityTrustResourceUrl('');
    this.fileBaseUrlPrevious = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  NavigateToAerosport() {
    this.router.navigate(['/aero-sport']);
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

          if (this.TsProbability.length > 0) {
            // Set default image URLs
            this.setDefaultImages();
            this.updateButtonVisibility();
          }

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

  setDefaultImages() {
    if (this.TsProbability.length > 0) {
      // Set the first image as the default previous day image
      this.loadImage(0, 'fileBaseUrlPrevious');

      // Set the second image as the default next day image if it exists
      if (this.TsProbability.length > 1) {
        this.loadImage(1, 'fileBaseUrlNext');
      }
    }
  }

  loadImage(index: number, target: 'fileBaseUrlPrevious' | 'fileBaseUrlNext') {
    this.APIService.GetAviationFile(
      this.TsProbability[index].foldername,
      this.TsProbability[index].filename
    ).subscribe(
      (data) => {
        const imageUrl = 'data:image/gif;base64,' + data.filetextcontent; // Adjust the MIME type accordingly
        this[target] = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
      },
      (error) => {
        console.log('Error fetching JSON data:', error);
        this.isLoading = false;
      }
    );
  }

  previousDay() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.loadImage(this.currentImageIndex, 'fileBaseUrlPrevious');
      this.updateButtonVisibility();
    }
  }

  nextDay() {
    if (this.currentImageIndex < this.TsProbability.length - 1) {
      this.currentImageIndex++;
      this.loadImage(this.currentImageIndex, 'fileBaseUrlNext');
      this.updateButtonVisibility();
    }
  }

  updateButtonVisibility() {
    this.prevday = this.currentImageIndex > 0;
    this.nextday = this.currentImageIndex < this.TsProbability.length - 1;
  }
}
