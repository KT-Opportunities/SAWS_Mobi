import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

interface FileData {
  foldername: string;
  filename: string;
  lastmodified: string;
  filetextcontent: string;
}

@Component({
  selector: 'app-color-coded-taf',
  templateUrl: './color-coded-taf.component.html',
  styleUrls: ['./color-coded-taf.component.scss'],
})
export class ColorCodedTafComponent  implements OnInit {
  loading = false;
  isLogged: boolean = false;
  TAFArray: FileData[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private iab: InAppBrowser,
    private spinner: NgxSpinnerService,
    private apiService: APIService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {

    this.spinner.show();
    this.loading = true;
    this.apiService.GetSourceTextFolderFilesTime('taffc', 4).subscribe(
      (Response: FileData[]) => {
        this.TAFArray = Response.map((item: FileData) => {
          const parts = item.filename.split('/');
          if (parts.length > 1) {
            const newFilename = parts.slice(1).join('/');
            return {
              ...item,
              filename: newFilename,
            };
          } else {
            return item;
          }
        });
        this.loading = false;
        this.spinner.hide();
        console.log('Response received:', Response);
        // Handle response data
      },
      (error) => {
        console.error('API Error:', error);
        this.loading = false; // Make sure to handle loading state in case of error
        this.spinner.hide(); // Ensure spinner is hidden on error
      }
    );

  }

  forecastPageNavigation() {
    this.router.navigate(['/forecast']);
  }

  extractHeadingContent(fileTextContent: string): string | null {
    // Use a regular expression to find the content starting with 'TAF'
    const regex = /TAF[\s\S]*?(?=TEMPO|$)/; // Matches from 'TAF' to 'TEMPO' or end of string
  
    const match = fileTextContent.match(regex);
  
    if (match) {
      return match[0]; // Return the matched content
    } else {
      return null; // Return null if no match found
    }
  }

  extractRemainingContent(filetextcontent: string): string {
    // Extract remaining content after the content used for <h1> (e.g., using regex or string manipulation)
    // Return the extracted content
    return filetextcontent.substring(filetextcontent.indexOf('TEMPO') + 5);
  }

}
