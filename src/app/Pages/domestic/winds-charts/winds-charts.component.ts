import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { DomSanitizer } from '@angular/platform-browser';
interface ImageData {
  url: string;
}
interface ResponseItem {
  foldername: string;
  filename: string;
  lastmodified: string;
  filetextcontent: string;
  // Add other properties if needed
}

@Component({
  selector: 'app-winds-charts',
  templateUrl: './winds-charts.component.html',
  styleUrls: ['./winds-charts.component.scss'],
})
export class WindsChartsComponent  implements OnInit {
// Array to store wind chart images fetched from the API
windChartImages: { url: string }[] = [];

// Property to store the URL of the selected image
selectedImageUrl: string | null = null;

isLogged: boolean = false;
loading: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private APIService: APIService,
    private iab: InAppBrowser,
    private sanitizer: DomSanitizer,
    private http: HttpClient // Inject HttpClient
  ) { }

  ngOnInit() {
    this.fetchWindChartImages();
  }
  
  isImageFile(filename: string): boolean {
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = filename.split('.').pop()?.toLowerCase();
    return fileExtension ? validExtensions.includes(fileExtension) : false;
  }

  
  fetchWindChartImages(): void {
    // this.loading = true;
    this.APIService.GetSourceAviationFolderFilesList('', 6).subscribe(
      (data: any[]) => {
        this.windChartImages = data.map((item) => {
          return {
            url: `http://160.119.253.130/aviappapi/api/RawSource/GetAviationFile?imagefoldername=${item.foldername}&imagefilename=${item.filename}`,
          };
        });
        // this.loading = false;
      },
      (error) => {
        console.error('Error fetching wind chart images:', error);
        // this.loading = false;
      }
    );
  }

  checkImageExistence(imageUrl: string): void {
    // Send an HTTP HEAD request to check if the image exists
    this.http.head(imageUrl).subscribe(
      () => {
        // Image exists, you can handle this as needed
        console.log(`Image exists: ${imageUrl}`);
      },
      (error) => {
        // Image does not exist, handle the error gracefully
        console.error(`Image does not exist: ${imageUrl}`, error);
      }
    );
  }

  
  viewImage(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
  }

  closeImage(): void {
    this.selectedImageUrl = null;
  }
  

}
