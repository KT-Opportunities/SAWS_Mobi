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
  styleUrls: ['./../domestic.page.scss'], // Adjust the path if needed
})
export class WindsChartsComponent implements OnInit {

  isLogged: boolean = false;
  isLoading: boolean = false;
  chartsArray: any[] = []; // Ensure this is an array
  sevenDigitNumbers: number[] = []; // Explicitly declare the type of this array
 
  chart = [
    // Sample data
    { title: 'Low level (surface to FL180)', filename: 'chart1.png' },
    { title: 'High level (above FL180)', filename: 'chart2.png' },
    // Add more chart data as needed
  ];

  blockFormats = [
    { format: 'FL010 to FL240', numbers: [12, 18, 24, 30, 36, 42, 48] },
    { format: 'FL210 to FL450', numbers: [12, 18, 24, 30, 36, 42, 48] },
    { format: 'FL010 to FL150', numbers: [12, 18, 24, 30, 36, 42, 48] },
    { format: 'FL150 to FL450', numbers: [12, 18, 24, 30, 36, 42, 48] },
    { format: 'All level scroll', numbers: [12, 18, 24, 30, 36, 42, 48] }
  ];

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
    this.isLoading = true;
    this.generateSevenDigitNumbers(7);
    this.fetchWindChartImages();
    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  generateSevenDigitNumbers(count: number) {
    this.sevenDigitNumbers = [];
    for (let i = 0; i < count; i++) {
      const number = Math.floor(1000000 + Math.random() * 9000000);
      this.sevenDigitNumbers.push(number);
    }
    this.sevenDigitNumbers.sort((a, b) => a - b);
    console.log('Generated and Sorted Seven Digit Numbers:', this.sevenDigitNumbers);
  }
  
  fetchWindChartImages() {
    this.APIService.fetchWindChartImages('', 12).subscribe(
      (data: any[]) => {
        console.log('API Response:', data);

        // Debug: Ensure 'data' is an array and contains objects with 'filename'
        if (!Array.isArray(data)) {
          console.error('API response is not an array:', data);
          this.isLoading = false;
          return;
        }

        console.log('Seven Digit Numbers:', this.sevenDigitNumbers);

        if (data && data.length > 0) {
          // Check if 'filename' exists and contains expected substrings
          const filteredData = data.filter(item => item.filename && (item.filename.includes('glwl') || item.filename.includes('vglwh')));
          console.log('Filtered Data:', filteredData);

          const limitedData = filteredData.slice(0, 7);
          console.log('Limited Data:', limitedData);

          // Ensure that each item in filteredData gets a sevenDigitNumber
          this.chartsArray = limitedData.map((item, index) => {
            const format = this.getChartFormat(item.filename);
            // Use modulus operator to handle cases where index >= sevenDigitNumbers.length
            const sevenDigitNumber = this.sevenDigitNumbers[index % this.sevenDigitNumbers.length] || 'N/A';
            console.log('Mapping item:', item, 'Format:', format, 'Seven Digit Number:', sevenDigitNumber);
            return {
              format: format,
              filename: item.filename,
              sevenDigitNumber: sevenDigitNumber
            };
          });

          console.log('Charts Array:', this.chartsArray);
        } else {
          console.warn('No valid data found in API response.');
        }

        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching wind chart images:', error);
        this.isLoading = false;
      }
    );
  }
  
  getChartFormat(filename: string): string {
    if (filename.includes('30')) return '30';
    if (filename.includes('36')) return '36';
    if (filename.includes('42')) return '42';
    if (filename.includes('48')) return '48';
    return 'Unknown Format';
  }

  removefile(filename: string): string {
    const match = filename.match(/\d+/);
    return match ? match[0] : '';
  }

  openImageViewer(item: any) {
    console.log('Opening', item);
    const folderName = '';
    const fileName = item.filename;

    if (folderName === '' && fileName) {
      this.isLoading = true;

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
    return new Promise<string>((resolve, reject) => {
      this.APIService.GetAviationFile(folderName, fileName).subscribe(
        (response) => {
          const filetextcontent = response.filetextcontent;
          console.log('File Text Content:', filetextcontent);
          resolve(filetextcontent);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  NavigateToDomestic() {
    this.router.navigate(['/domestic']);
  }
}
