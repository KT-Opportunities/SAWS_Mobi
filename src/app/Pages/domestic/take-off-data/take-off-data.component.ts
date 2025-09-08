import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

interface ResponseItem {
  foldername: string;
  filename: string;
  lastmodified: string;
  filecontent: string;
  vermetTableData: any[];
}
@Component({
  selector: 'app-take-off-data',
  templateUrl: './take-off-data.component.html',
  styleUrls: ['./../domestic.page.scss'],
})
export class TakeOffDataComponent implements OnInit {
   @ViewChild('airportSelect') airportSelect!: ElementRef<HTMLSelectElement>;
   isLoading = false;
   selectedAirportCode: string = ''; 
   VermetArray: ResponseItem[] = [];
 
   constructor(
     private router: Router,
     private authService: AuthService,
     private elRef: ElementRef,
     private iab: InAppBrowser,
     private spinner: NgxSpinnerService,
     private apiService: APIService,
     private dialog: MatDialog
   ) {}
 
   ngOnInit() {
     this.isLoading = true;
     this.spinner.show();
 
     this.apiService.GetSourceTextFolderFiles('varmet').subscribe((Response) => {
       console.log('📥 Raw API Response:', Response);
 
       if (!Response || Response.length === 0) {
         this.isLoading = false;
         this.spinner.hide();
         console.warn('⚠️ No data returned from API');
         return;
       }
 
       // ✅ Step 1: Group by airport and keep only latest file
       const airportMap = Response.reduce(
         (acc: { [key: string]: ResponseItem }, item: ResponseItem) => {
           const airportCode = this.getAirportCode(item);
           if (
             !acc[airportCode] ||
             new Date(item.lastmodified) > new Date(acc[airportCode].lastmodified)
           ) {
             acc[airportCode] = item;
           }
           return acc;
         },
         {}
       );
 
       // ✅ Step 2: Convert back to array and filter TAKE-OFF files
       this.VermetArray = (Object.values(airportMap) as ResponseItem[]).filter(
         (item: ResponseItem) => item.filecontent.includes('TAKE-OFF')
       );
 
       console.log('✈️ Filtered VermetArray:', this.VermetArray);
 
       // ✅ Step 3: Parse filecontent into structured table data
       this.VermetArray.forEach((item) => {
         item.vermetTableData = this.extractTableData(item.filecontent);
         console.log(`📊 Parsed data for ${item.filename}:`, item.vermetTableData);
       });
 
       this.isLoading = false;
       this.spinner.hide();
     });
   }
 
   /** Dropdown selection change */
   onAirportCodeChange(code: string) {
     this.selectedAirportCode = code;
   }
 
 shouldDisplayItem(item: ResponseItem) {
   return !this.selectedAirportCode || this.selectedAirportCode === 'ALL' || this.getAirportCode(item) === this.selectedAirportCode;
 }
 
   /** Parse filecontent into table rows */
   extractTableData(filecontent: string) {
     const lines = filecontent
       .split('\n')
       .map((l) => l.trim())
       .filter((l) => l);
 
     // find first TIME header
     const startIndex = lines.findIndex((l) => l.startsWith('TIME'));
     if (startIndex === -1) return [];
 
     const headers = lines[startIndex].split(/\s+/);
 
     const rows = [];
     for (let i = startIndex + 1; i < lines.length; i++) {
       const line = lines[i];
       if (line.endsWith('=')) break; // stop at end marker
 
       const cols = line.split(/\s+/);
       if (cols.length >= 4) {
         rows.push({
           time: cols[0] || '',
           temp: cols[1] || '',
           qnh: cols[2] || '',
           qan: cols[3] || '',
         });
       }
     }
 
     // ✅ only keep rows that look valid
     const cleanRows = rows.filter((r) => r.time.endsWith('Z') || r.time === '----');
 
     return [headers, ...cleanRows];
   }
 
   /** Extract TAKE-OFF DATA header line */
   extractTakeOffData(filecontent: string): string {
     const match = filecontent.match(/TAKE-OFF DATA.*$/im);
     return match ? match[0].trim() : '';
   }
 
   /** Extract 4-letter ICAO from ResponseItem */
   getAirportCode(item: ResponseItem): string {
     // Simple match: take first 4-letter uppercase code in filecontent
     const match = item.filecontent.match(/\b[A-Z]{4}\b/);
     return match ? match[0] : '';
   }
 
   forecastPageNavigation() {
     this.router.navigate(['/forecast']);
   }
 
   ScrollToTop(value: any) {
     const element = document.getElementById(value);
     element?.scrollIntoView({ behavior: 'smooth' });
   }
 
     openDropdown() {
     // Focus the select element so it opens
     this.airportSelect.nativeElement.focus();
     // Optional: open programmatically on some browsers
     this.airportSelect.nativeElement.click();
   }
  NavigateToDomestic() {
    this.router.navigate(['/domestic']);
  }

}
