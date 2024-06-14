import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageViewrPage } from '../../image-viewr/image-viewr.page';

@Component({
  selector: 'app-winds-charts',
  templateUrl: './winds-charts.component.html',
  // styleUrls: ['./winds-charts.component.scss'],
  styleUrls: ['./../domestic.page.scss'],
})
export class WindsChartsComponent  implements OnInit {

  isLogged: boolean = false;
  isLoading: boolean = false;
  images: { name: string, url: string }[] = [];
  chartsArray: any = [];
 
    constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private APIService: APIService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isLoading = true; // Set isLoading to true initially
    this.fetchWindChartImages();
    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
   
    }
  }

  fetchWindChartImages() {
    // Make HTTP request to fetch wind chart images
    this.APIService.fetchWindChartImages('',12).subscribe(
      (data: any[]) => {
        console.log('API Response:', data); // Log the entire API response for debugging
        
        if (data && data.length > 0) {
          // Filter and map API response to construct charts array
         
          this.chartsArray = data;
          this. chartsArray = data
          .filter(item => item.filename && (item.filename.includes('glwl') || item.filename.includes('vglwh')))
          // .map(item => ({
          //   title: item.filename,
          //   imageUrl: this.constructImageUrl(item)
          // }));
          // console.log('chart', this.chartsArray)

    
          console.log('Charts:', this. chartsArray); // Log the constructed charts array for debugging
        } else {
          console.warn('No valid data found in API response.');
        }

       
        
        // Set isLoading to false after processing data
        this.isLoading = false;
      },
      (error) => {
        // Log error if fetching data fails
        console.error('Error fetching wind chart images:', error);
        
        // Set isLoading to false in case of error
        this.isLoading = false;
      }
    );
  }

  removefile(filename: string): string {
    // Extract numeric part using a regular expression
    const match = filename.match(/\d+/);
    return match ? match[0] : '';
  }
  

openImageViewer(item: any) {
  console.log('Opening', item); 
  console.log('openImageViewer', item);
  const folderName = '';
  const fileName = item.filename;
  console.log ('file', fileName);

  // Check if folderName and fileName are defined
  if (folderName == '' && fileName) {
    this.isLoading = true;

    // Call fetchSecondAPI with folderName and fileName
    this.fetchSecondAPI(folderName, fileName)
      .then((filetextcontent) => {
        this.isLoading = false;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = '80%';
        dialogConfig.height = '80%';
        dialogConfig.data = { filetextcontent };

        const dialogRef = this.dialog.open(ImageViewrPage, dialogConfig);

        dialogRef.afterClosed().subscribe(() => {
          this.isLoading = false;
        });
      })
      .catch((error) => {
        console.error('Error fetching file content:', error);
        this.isLoading = false;
      });
  } else {
    console.error('Folder name or file name is undefined.');
  }
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

  NavigateToDomestic() {
    this.router.navigate(['/domestic']);
  }

}
