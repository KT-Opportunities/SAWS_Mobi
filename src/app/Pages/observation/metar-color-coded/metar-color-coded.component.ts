import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ViewDecodedPage } from '../../view-decoded/view-decoded.page';

// Define an interface to strongly type the MetarReport
interface MetarReport {
  filecontent: string;
  // Add other properties of the MetarReport object here
}

@Component({
  selector: 'app-metar-color-coded',
  templateUrl: './metar-color-coded.component.html',
  styleUrls: ['./metar-color-coded.component.scss'],
})
export class MetarColorCodedComponent implements OnInit {
  isLogged: boolean = false;
  loading: boolean = false;
  metarReports: MetarReport[] = [];
  filteredReports: MetarReport[] = [];
  searchQuery: string = '';


  selectedProvince: string = 'Gauteng'; // Default selected province

  airportProvinceMapping: { [key: string]: string } = {
    FAOR: 'Gauteng', FALA: 'Gauteng', FAJB: 'Gauteng', FAIR: 'Gauteng', FAWB: 'Gauteng',
    FAWK: 'Gauteng', FAGC: 'Gauteng', FAGM: 'Gauteng', FASI: 'Gauteng', FAVV: 'Gauteng',
    FAPP: 'Limpopo', FALM: 'Limpopo', FAHS: 'Limpopo', FATH: 'Limpopo', FATV: 'Limpopo',
    FAER: 'Limpopo', FATZ: 'Limpopo', FATI: 'Limpopo', FAVM: 'Limpopo', FAKN: 'Mpumalanga',
    FANS: 'Mpumalanga', FAEO: 'Mpumalanga', FASR: 'Mpumalanga', FAWI: 'Mpumalanga', FAKP: 'Mpumalanga',
    FASZ: 'Mpumalanga', FAMM: 'Northwest Province', FALI: 'Northwest Province', FAKD: 'Northwest Province',
    FARG: 'Northwest Province', FAPN: 'Northwest Province', FAPS: 'Northwest Province', FAMK: 'Northwest Province',
    FACT: 'Western Cape', FAGG: 'Western Cape', FALW: 'Western Cape', FAOB: 'Western Cape', FABY: 'Western Cape',
    FAPG: 'Western Cape', FAYP: 'Western Cape', FAOH: 'Western Cape', FAPE: 'Eastern Cape', FAEL: 'Eastern Cape',
    FAUT: 'Eastern Cape', FABE: 'Eastern Cape', FALE: 'KwaZulu Natal', FAPM: 'KwaZulu Natal', FARB: 'KwaZulu Natal',
    FAMG: 'KwaZulu Natal', FAVG: 'KwaZulu Natal', FAGY: 'KwaZulu Natal', FAUL: 'KwaZulu Natal', FALY: 'KwaZulu Natal',
    FANC: 'KwaZulu Natal', FAMX: 'KwaZulu Natal', FABL: 'Freestate', FABM: 'Freestate', FAWM: 'Freestate',
    FAHV: 'Freestate', FAKS: 'Freestate', FAFB: 'Freestate', FAUP: 'Northern Cape', FAKM: 'Northern Cape',
    FADY: 'Northern Cape', FACV: 'Northern Cape', FASB: 'Northern Cape', FAAB: 'Northern Cape', FASS: 'Northern Cape',
    FDMS: 'Swaziland', FDSK: 'Swaziland', FXMM: 'Lesotho', FBSK: 'Botswana', FBMN: 'Botswana', FBFT: 'Botswana',
    FBGZ: 'Botswana', FBJW: 'Botswana', FBKE: 'Botswana', FBMP: 'Botswana', FBPA: 'Botswana', FBTE: 'Botswana',
    FBTS: 'Botswana', FBSN: 'Botswana', FBSP: 'Botswana', FBSW: 'Botswana', FBLT: 'Botswana', FYWH: 'Namibia',
    FYWW: 'Namibia', FYWE: 'Namibia', FYKM: 'Namibia', FYKT: 'Namibia', FYWB: 'Namibia', FYGF: 'Namibia',
    FYLZ: 'Namibia', FYOA: 'Namibia', FYOG: 'Namibia', FYRU: 'Namibia', FQMA: 'Mozambique', FQBR: 'Mozambique',
    FQNP: 'Mozambique', FQIN: 'Mozambique', FQLC: 'Mozambique', FQPB: 'Mozambique', FQQL: 'Mozambique',
    FQTE: 'Mozambique', FQTT: 'Mozambique', FQVL: 'Mozambique', FVRG: 'Zimbabwe', FVJN: 'Zimbabwe', FVKB: 'Zimbabwe',
    FVFA: 'Zimbabwe', FVCZ: 'Zimbabwe', FVTL: 'Zimbabwe', FVWN: 'Zimbabwe', FWKI: 'Other Regions', FWCL: 'Other Regions',
    FLKK: 'Other Regions', FLSK: 'Other Regions', FNLU: 'Other Regions', FLHN: 'Other Regions', FLND: 'Other Regions',
    FAME: 'Other Stations'
  };
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: APIService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fetchMetarReports();
  }
  getFilteredReports() {
    // return this.metarReports.filter(
    //   // report => this.airportProvinceMapping[report.airportCode] === this.selectedProvince
    // );
  }
  navigateToObservation(): void {
    this.router.navigate(['/observation']);
  }

  fetchMetarReports(): void {
    this.loading = true; // Set loading to true before fetching data
    this.spinner.show(); // Show spinner while fetching data

    const foldername = 'metar';
    this.apiService.getRecentTafs(foldername).subscribe(
      (data: MetarReport[]) => {
        console.log('Metar reports fetched successfully:', data);
        this.metarReports = data;
        this.filteredReports = data; // Initialize filteredReports with all reports
        this.loading = false; // Set loading to false after data is fetched
        this.spinner.hide(); // Hide spinner after data is fetched
      },
      (error) => {
        console.error('Error fetching Metar Reports:', error);
        this.loading = false; // Set loading to false in case of error
        this.spinner.hide(); // Hide spinner in case of error
      }
    );
  }

  // Function to filter the reports based on the search query
  onSearch(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredReports = this.metarReports; // If search query is empty, show all reports
    } else {
      this.filteredReports = this.metarReports.filter((report) =>
        report.filecontent.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }
  isLoading: boolean = true;
  item: any;
  ImageViewer(item: any) {
    console.log('file Name:', item);
    const folderName = 'sigw';
    const fileName = item;
    console.log('Folder Name:', folderName);
    this.isLoading = true;

  
        this.isLoading = false;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = '80%';
        dialogConfig.height = '80%';
        dialogConfig.data = { item };

        const dialogRef = this.dialog.open(ViewDecodedPage, dialogConfig);

        dialogRef.afterClosed().subscribe(() => {
          this.isLoading = false;
        });
    
  }
}
