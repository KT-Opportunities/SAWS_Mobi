import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ViewDecodedPage } from '../../view-decoded/view-decoded.page';
import { DatePipe } from '@angular/common';
import { Keyboard } from '@capacitor/keyboard';
import { MediaMatcher } from '@angular/cdk/layout';
import { FormBuilder } from '@angular/forms';
import { Platform, ToastController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewColorCodedStylePage } from '../../Pages/view-color-coded-style/view-color-coded-style.page';
interface FileData {
  foldername: string;
  filename: string;
  lastmodified: string;
  filecontent: string;
}
@Component({
  selector: 'app-recent-tafs',
  templateUrl: './recent-tafs.component.html',
  styleUrls: ['./../forecast.page.scss'],
})
export class RecentTafsComponent implements OnInit, OnDestroy {
  loading = false;
  isLogged: boolean = false;
  isLoading: boolean = true;
  recentTafs: any[] = [];
  filteredTafs: any[] = []; // New variable to store filtered TAFs
  filteredList: any = ([] = []);
  searchQuery: string = '';

  isDropdownOpen1: boolean = false;
  isDropdownOpen2: boolean = false;
  isDropdownOpen3: boolean = false;
  selectedOption1: string = 'select saved Template';
  selectedOption2: string = 'Last Hour';
  selectedOption3: string = '5 minutes';

  intervalId: any;
  SigmetList: any = [];

  isKeyboardVisible = false;
  private mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  isMobile: boolean;
    TAFArray: FileData[] = [];
    groupedTAFs: { [province: string]: string[] } = {};
    currentDate?: string;
    currentTime?: string;
    objectKeys = Object.keys;
    viewModes: { [province: string]: 'normal' | 'color' } = {};
    item: any;
    searchDone: boolean = false;  // NEW flag to track search
  includeSigmets: boolean = false; // already exists
filteredSigmetList: any[] = []; 
// Inside your component class
filteredGroupedTAFs: { [province: string]: string[] } = {};
refreshInterval: any;  // will hold setInterval reference



   provinces: { [province: string]: string[] } = {
    'Gauteng': ['FAOR','FALA','FAJB','FAIR','FAWB','FAWK','FAGC','FAGM','FASI','FAVV'],
    'Limpopo': ['FAPP','FALM','FAHS','FATH','FATV','FAER','FATZ','FATI','FAVM'],
    'Mpumalanga': ['FAKN','FANS','FAEO','FASR','FAWI','FAKP','FASZ'],
    'Northwest Province': ['FAMM','FALI','FAKD','FARG','FAPN','FAPS','FAMK'],
    'Western Cape': ['FACT','FAGG','FALW','FAOB','FABY','FAPG','FAYP','FAOH'],
    'Eastern Cape': ['FAPE','FAEL','FAUT','FABE'],
    'KwaZulu Natal': ['FALE','FAPM','FARB','FAMG','FAVG','FAGY','FAUL','FALY','FANC','FAMX'],
    'Freestate': ['FABL','FABM','FAWM','FAHV','FAKS','FAFB'],
    'Northern Cape': ['FAUP','FAKM','FADY','FACV','FASB','FAAB','FASS'],
    'Lesotho': ['FXMM'],
    'Eswatini': ['FDMS','FDSK'],
    'Botswana': ['FBSK','FBMN','FBFT','FBGZ','FBJW','FBKE','FBMP','FBPA','FBTE','FBTS','FBSN','FBSP','FBSW','FBLT'],
    'Namibia': ['FYWH','FYWE','FYKM','FYKT','FYWB','FYGF','FYLZ','FYOA','FYOG','FYRU'],
    'Mozambique': ['FQMA','FQBR','FQNP','FQIN','FQLC','FQPB','FQQL','FQTE','FQTT','FQVL'],
    'Zimbabwe': ['FVRG','FVJN','FVKB','FVFA','FVCZ','FVTL','FVWN'],
    'Other Regions': ['FWKI','FWCL','FLKK','FLSK','FNLU','FLHN','FLND'],
    'Other Stations': ['FAME']
  };

  timeFilterMap: { [key: string]: number } = {
  'Most Recent': 1,
  'Last 1 hour': 1,
  'Last 2 hours': 2,
  'Last 3 hours': 3,
  'Last 4 hours': 4,
  'Last 5 hours': 5,
  'Last 6 hours': 6,
  'Last 12 hours': 12,
  'Last 18 hours': 18,
  'Last 24 hours': 24,
  'Last 36 hours': 36,
};
airportNames: { [code: string]: string } = {
  // Gauteng
  'FAOR': 'O. R. Tambo International Airport ',
  'FALA': 'Lanseria International Airport ',
  'FAJB': 'Johannesburg International Airport ',
  'FAIR': 'Air Force Base Waterkloof ',
  'FAWB': 'Waterkloof Air Force Base ',
  'FAWK': 'Wonderboom Airport ',
  'FAGC': 'Grand Central Airport ',
  'FAGM': 'Germiston Airport ',
  'FASI': 'Springs Airport ',
  'FAVV': 'Vaal Airport',

  // Limpopo
  'FAPP': 'Polokwane International Airport ',
  'FALM': 'Makhado Airport ',
  'FAHS': 'Hoedspruit Airport ',
  'FATH': 'Thohoyandou Airport ',
  'FATV': 'Tzaneen Airport',
  'FAER': 'Ellisras Matimba Airport ',
  'FATZ': 'Thabazimbi Airport ',
  'FATI': 'Tshipise Airport ',
  'FAVM': 'Vivo Airport ',

  // Mpumalanga
  'FAKN': 'Kruger Mpumalanga International Airport ',
  'FANS': 'Nelspruit Airport ',
  'FAEO': 'Emoyeni Airport (Emoyeni)',
  'FASR': 'Skukuza Airport ',
  'FAWI': 'White River Airport ',
  'FAKP': 'Komatipoort Airport ',
  'FASZ': 'Skukuza Airport ',

  // Northwest Province
  'FAMM': 'Mafikeng International Airport',
  'FALI': 'Lichtenburg Airport ',
  'FAKD': 'Klerksdorp Airport ',
  'FARG': 'Rustenburg Airport ',
  'FAPN': 'Potchefstroom Airport',
  'FAPS': 'Schweizer-Reneke Airport ',
  'FAMK': 'Mmabatho International Airport ',

  // Western Cape
  'FACT': 'Cape Town International Airport ',
  'FAGG': 'George Airport ',
  'FALW': 'Langebaanweg Airport ',
  'FAOB': 'Oudtshoorn Airport ',
  'FABY': 'Beaufort West Airport ',
  'FAPG': 'Plettenberg Bay Airport ',
  'FAYP': 'Ysterplaat Airport ',
  'FAOH': 'Overberg Airport ',

  // Eastern Cape
  'FAPE': 'Port Elizabeth International Airport ',
  'FAEL': 'East London Airport ',
  'FAUT': 'Umtata Airport ',
  'FABE': 'Bhisho Airport ',

  // KwaZulu-Natal
  'FALE': 'King Shaka International Airport ',
  'FAPM': 'Pietermaritzburg Airport ',
  'FARB': 'Richards Bay Airport ',
  'FAMG': 'Margate Airport ',
  'FAVG': 'Virginia Airport ',
  'FAGY': 'Greytown Airport ',
  'FAUL': 'Ulundi Airport ',
  'FALY': 'Ladysmith Airport ',
  'FANC': 'Newcastle Airport ',
  'FAMX': 'Mkuze Airport ',

  // Freestate
  'FABL': 'Bram Fischer International Airport ',
  'FABM': 'Bethlehem Airport ',
  'FAWM': 'Welkom Airport ',
  'FAHV': 'Harrismith Airport )',
  'FAKS': 'Kroonstad Airport',
  'FAFB': 'Bothaville Airport ',

  // Northern Cape
  'FAUP': 'Upington Airport ',
  'FAKM': 'Kimberley Airport ',
  'FADY': 'De Aar Airport ',
  'FACV': 'Calvinia Airport ',
  'FASB': 'Sishen Airport ',
  'FAAB': 'Alexander Bay Airport ',
  'FASS': 'Sutherland Airport ',

  // Lesotho
  'FXMM': 'Moshoeshoe I International Airport ',

  // Eswatini
  'FDMS': 'King Mswati III International Airport ',
  'FDSK': 'Matsapha Airport ',

  // Botswana
  'FBSK': 'Sir Seretse Khama International Airport ',
  'FBMN': 'Maun Airport ',
  'FBFT': 'Francistown International Airport ',
  'FBGZ': 'Kasane Airport ',
  'FBJW': 'Jwaneng Airport ',
  'FBKE': 'Keetmanshoop Airport ',
  'FBMP': 'Mopipi Airport ',
  'FBPA': 'Palapye Airport ',
  'FBTE': 'Tsabong Airport',
  'FBTS': 'Tswapong Airport ',
  'FBSN': 'Serowe Airport ',
  'FBSP': 'Sowa Town Airport ',
  'FBSW': 'Selebi-Phikwe Airport ',
  'FBLT': 'Letlhakane Airport ',

  // Namibia
  'FYWH': 'Hosea Kutako International Airport ',
  'FYWE': 'Eros Airport ',
  'FYKM': 'Katima Mulilo Airport',
  'FYKT': 'Keetmanshoop Airport ',
  'FYWB': 'Walvis Bay Airport ',
  'FYGF': 'Grootfontein Airport ',
  'FYLZ': 'Luderitz Airport ',
  'FYOA': 'Ondangwa Airport',
  'FYOG': 'Oranjemund Airport ',
  'FYRU': 'Rundu Airport ',

  // Mozambique
  'FQMA': 'Maputo International Airport ',
  'FQBR': 'Beira Airport ',
  'FQNP': 'Nacala Airport ',
  'FQIN': 'Nampula Airport ',
  'FQLC': 'Lichinga Airport ',
  'FQPB': 'Pemba Airport ',
  'FQQL': 'Quelimane Airport',
  'FQTE': 'Tete Airport ',
  'FQTT': 'Tete Airport',
  'FQVL': 'Vilankulo Airport ',

  // Zimbabwe
  'FVRG': 'Robert Gabriel Mugabe International Airport',
  'FVJN': 'Joshua Mqabuko Nkomo International Airport ',
  'FVKB': 'Kariba Airport ',
  'FVFA': 'Victoria Falls Airport',
  'FVCZ': 'Masvingo Airport ',
  'FVTL': 'Mutare Airport ',
  'FVWN': 'Hwange National Park Airport',

  // Other Regions
  'FWKI': 'Kisumu Airport ',
  'FWCL': 'Chlef International Airport',
  'FLKK': 'Kikwit Airport ',
  'FLSK': 'Sassandra Airport ',
  'FNLU': 'Luanda Airport ',
  'FLHN': 'Honiara International Airport',
  'FLND': "N'Djamena International Airport",

  // Other Stations
  'FAME': 'Malamala Game Reserve Airport',
};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mediaMatcher: MediaMatcher,
    private authService: AuthService,
    private apiService: APIService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private renderer: Renderer2,
    private toastController: ToastController,
    private platform: Platform,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private elRef: ElementRef,
    private iab: InAppBrowser,
    private datePipe: DatePipe
  ) {
    this.mobileQuery = this.mediaMatcher.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => (this.isMobile = this.mobileQuery.matches);
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
    this.isMobile = this.mobileQuery.matches;

    Keyboard.addListener('keyboardWillShow', () => {
      this.isKeyboardVisible = true;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      this.isKeyboardVisible = false;
    });
  }

    ngOnInit(): void {
    this.spinner.show();
   // Start with an empty combined array and taf map
  this.TAFArray = [];
  const allTAFs: { [icao: string]: string } = {};
  
  this.loadTAFs();   // 👈 now just call this
  this.loadSigmet();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);

    Keyboard.removeAllListeners();
  }
// Add this method inside your component
loadTAFs(): void {
  this.spinner.show();
  this.TAFArray = [];
  const allTAFs: { [icao: string]: string } = {};

  // taffc fetch
  this.apiService.GetSourceTextFolderFilesTime('taffc', 72).subscribe(
    (response: FileData[]) => {
      this.TAFArray = [...this.TAFArray, ...response];

      if (response.length > 0) {
        this.updateTime(response[0].lastmodified);
      }

      response.forEach(file => {
        const matches = file.filecontent.match(/TAF\s+[A-Z]{4}[\s\S]*?=/g);
        if (matches) {
          matches.forEach(entry => {
            const icao = entry.match(/TAF\s+([A-Z]{4})/)?.[1];
            if (icao) {
              allTAFs[icao] = entry.trim();
            }
          });
        }
      });

      this.groupTAFsByProvince(allTAFs);
      this.spinner.hide();
    }
  );

  // tafft fetch
  this.apiService.GetSourceTextFolderFilesTime('tafft', 72).subscribe(
    (response: FileData[]) => {
      this.TAFArray = [...this.TAFArray, ...response];

      if (response.length > 0) {
        this.updateTime(response[0].lastmodified);
      }

      response.forEach(file => {
        const matches = file.filecontent.match(/TAF\s+[A-Z]{4}[\s\S]*?=/g);
        if (matches) {
          matches.forEach(entry => {
            const icao = entry.match(/TAF\s+([A-Z]{4})/)?.[1];
            if (icao) {
              allTAFs[icao] = entry.trim();
            }
          });
        }
      });

      this.groupTAFsByProvince(allTAFs);
      this.spinner.hide();
    }
  );
}

   
    updateTime(date?: string) {
      this.currentDate = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
      this.currentTime = this.datePipe.transform(date, 'HH:mm:ss') || '';
    }

  forecastPageNavigation() {
    this.router.navigate(['/forecast']);
  }

  fetchRecentTafs(): void {
    this.loading = true; // Set loading to true when fetching starts
    this.spinner.show(); // Show the spinner

    const foldername = 'metar'; // Specify the folder name
    this.apiService.getRecentTafs(foldername).subscribe(
      (data) => {
        // Assign fetched data to recentTafs array
        this.recentTafs = data;
        this.filteredTafs = data;
        console.log("RECENT METAR:",this.recentTafs)
        // Set loading to false when fetching is complete
        this.loading = false;
        // Hide the spinner
        this.spinner.hide();

        this.updateTime(this.recentTafs[0]?.lastmodified)
      },
      (error) => {
        // Log error to console
        console.error('Error fetching recent TAFs:', error);
        // Set loading to false when an error occurs
        this.loading = false;
        // Hide the spinner
        this.spinner.hide();
      }
    );
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
filterTafs() {
  const query = this.searchQuery?.trim().toUpperCase();

  if (!query) {
    this.filteredGroupedTAFs = {};
    this.filteredSigmetList = [];
    this.searchDone = false;
    return;
  }

  this.filteredGroupedTAFs = {};

  // ✅ Filter grouped TAFs
  Object.keys(this.groupedTAFs).forEach(province => {
    const matchingTafs = this.groupedTAFs[province].filter(taf =>
      taf.toUpperCase().includes(query)
    );
    if (matchingTafs.length > 0) {
      this.filteredGroupedTAFs[province] = matchingTafs;
    }
  });

  // ✅ Filter SIGMETs if checkbox is checked
  if (this.includeSigmets) {
    this.filteredSigmetList = this.SigmetList.filter((sig: any) =>
      sig.filecontent.toUpperCase().includes(query) ||   // 👈 search in full text
      sig.heading.toUpperCase().includes(query)          // 👈 keep heading search too
    );
  } else {
    this.filteredSigmetList = [];
  }

  this.searchDone = true;
}






  onSearch(event: Event) {
    event.preventDefault(); // Prevent the form from submitting
    this.filterTafs(); // Call the filter function
  }
  forecastDropdown(dropdown: string) {
    switch (dropdown) {
      case 'dropdown1':
        this.isDropdownOpen1 = !this.isDropdownOpen1;
        this.isDropdownOpen2 = false;
        this.isDropdownOpen3 = false;
        break;
      case 'dropdown2':
        this.isDropdownOpen2 = !this.isDropdownOpen2;
        this.isDropdownOpen1 = false;
        this.isDropdownOpen3 = false;
        break;
      case 'dropdown3':
        this.isDropdownOpen3 = !this.isDropdownOpen3;
        this.isDropdownOpen1 = false;
        this.isDropdownOpen2 = false;
        break;
    }
    this.cdRef.detectChanges(); // Ensure change detection
  }

  selectOption(option: string, dropdown: string, event: MouseEvent) {
    event.stopPropagation(); // Prevent event bubbling
    switch (dropdown) {
      case 'dropdown1':
        this.selectedOption1 = option;
        this.isDropdownOpen1 = false;
        break;
      case 'dropdown2':
        this.selectedOption2 = option;
        this.isDropdownOpen2 = false;
          const hours = this.timeFilterMap[option];
    if (hours) {
      this.loadTAFsByTime(hours);
    }
        break;
      case 'dropdown3':
        this.selectedOption3 = option;
        this.isDropdownOpen3 = false;
         this.setRefreshInterval(option);
        break;
    }
    this.cdRef.detectChanges(); // Ensure change detection
  }



  ScrollToTop(value: any) {
    var element = document.getElementById(value);
    element?.scrollIntoView({ behavior: 'smooth' });
  }
  

    ImageViewer(item: any) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '80%';
      dialogConfig.height = '80%';
      dialogConfig.data = { item };
      this.dialog.open(ViewDecodedPage, dialogConfig);
    }
  

 
   extractHeadingContent(filecontent: string): string {
      const match = filecontent.match(/METAR[\s\S]*?(?=TEMPO|$)/);
      return match ? match[0] : '';
    }
  
     extractRemainingContent(filecontent: string): string {
      const index = filecontent.indexOf('TEMPO');
      return index >= 0 ? filecontent.substring(index + 5) : '';
    }
  
  groupTAFsByProvince(allTAFs: { [icao: string]: string }) {
    const grouped: { [province: string]: string[] } = {};
  
    for (const province in this.provinces) {
      grouped[province] = [];
  
      this.provinces[province].forEach(station => {
        if (allTAFs[station]) {
          grouped[province].push(allTAFs[station]);
        } else {
          grouped[province].push(`No data for ${station}`);
        }
      });
  
      // Default view mode
      this.viewModes[province] = 'normal';
    }
  
    this.groupedTAFs = grouped;
  }
  
  toggleView(province: string): void {
    this.viewModes[province] =
      this.viewModes[province] === 'normal' ? 'color' : 'normal';
  }
  
    ViewColorCodedStyle() {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.width = '80%';
      dialogConfig.height = '80%';
  
  
      const dialogRef = this.dialog.open(ViewColorCodedStylePage, dialogConfig);
  
      dialogRef.afterClosed().subscribe(() => {
        this.loading = false;
      });
    }

      formatSigmetForDisplay(content: string): string {
    if (!content) return '';

    let cleaned = content
      .replace(/[\u0000-\u0009\u000B-\u000C\u000E-\u001F]+/g, '')
      .replace(/\r\r\n|\r\n|\r/g, '\n')
      .replace(/^\s*\d+\s*$/gm, '')
      .trim();

    const startRegex = /\bFA(?:CA|JA|JO)\s+(?:SIGMET|AIRMET)\b/;
    const startIdx = cleaned.search(startRegex);
    cleaned = startIdx >= 0 ? cleaned.slice(startIdx) : cleaned;

    const endIdx = cleaned.indexOf('=');
    let singleMsg = endIdx >= 0 ? cleaned.slice(0, endIdx + 1) : cleaned;

    singleMsg = singleMsg.replace(/FAOR-(?!\n)/g, 'FAOR-\n');
    singleMsg = singleMsg.replace(/\bWI\b(?!\n)/g, 'WI\n');
    singleMsg = singleMsg.replace(/\n{2,}/g, '\n');

    const lines = singleMsg.split('\n');
    const formattedLines = lines.map(line => {
      if (line.match(/[NS]\d{4}\s+[EW]\d{5}/)) {
        const parts = line.split(/\s*-\s*/);
        const padded = parts.map(p => p.trim().padEnd(15, ' '));
        return padded.join(' - ');
      }
      return line;
    });

    return formattedLines.join('\n').trim().replace(/\n/g, '<br>');
  }

  filterbySearch(event: Event) {
    let element = document.getElementById('searchValue') as HTMLInputElement;
    const filterValue = element?.value || '';
    if (!filterValue) {
      this.SigmetList = this.filteredList;
      return;
    }

    this.SigmetList = this.SigmetList.filter((a: any) =>
      a.filecontent?.toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  async loadSigmet() {
  this.isLoading = true;

  const firMapping: { [key: string]: string } = {
    'FACA CAPE TOWN FIR': 'FACA (CAPE TOWN FIR)',
    'FAJO JOHANNESBURG OCEANIC FIR': 'FAJO (JOHANNESBURG OCEANIC FIR)',
    'FAJA JOHANNESBURG FIR': 'FAJA (JOHANNESBURG FIR)',
  };

  const sortedFirs = Object.keys(firMapping).sort((a, b) => b.length - a.length);

  // Helper to process each response
  const processResponse = (response: any[]) =>
    response
      .map((el: any) => {
        const fileContent = el.filecontent.toUpperCase();
        const afterFaor = fileContent.split('FAOR-')[1] || '';
        const firKey = sortedFirs.find(fir =>
          new RegExp(`\\b${fir}\\b`).test(afterFaor)
        );

        return {
          heading: firKey ? firMapping[firKey] : 'Unknown FIR',
          filecontent: el.filecontent,
        };
      })
      .filter(el => el.heading !== 'Unknown FIR');

  // Fetch SIGMET only
  this.apiService.GetSourceTextFolderFiles('sigmet').subscribe((sigmets: any[]) => {
    this.SigmetList = processResponse(sigmets);
    this.updateTime(new Date().toISOString());

    // Custom order
    const customOrder = [
      'Search',
      'FAJA (JOHANNESBURG FIR)',
      'FACA (CAPE TOWN FIR)',
      'FAJO (JOHANNESBURG OCEANIC FIR)'
    ];

    // Sort according to custom order
    this.SigmetList.sort((a: any, b: any) => {
      const indexA = customOrder.indexOf(a.heading);
      const indexB = customOrder.indexOf(b.heading);
      return indexA - indexB;
    });

    console.log("SIGMET Data (sorted):", this.SigmetList);
    this.isLoading = false;
  });
}
setRefreshInterval(option: string) {
  // Clear any existing interval
  if (this.refreshInterval) {
    clearInterval(this.refreshInterval);
  }

  let minutes = 0;
  if (option.includes("1")) minutes = 1;
  else if (option.includes("2")) minutes = 2;
  else if (option.includes("3")) minutes = 3;
  else if (option.includes("4")) minutes = 4;
  else if (option.includes("5")) minutes = 5;

  if (minutes > 0) {
    this.refreshInterval = setInterval(() => {
      this.refreshData();
    }, minutes * 60 * 1000); // convert to milliseconds
  }
}
refreshData() {
  console.log("Refreshing TAF data...");
  this.loading = true;
  this.loadTAFs(); // or however you fetch data
  this.loading = false;
}
loadTAFsByTime(hours: number): void {
  this.spinner.show();
  this.TAFArray = [];
  const allTAFs: { [icao: string]: string } = {};

  this.apiService.GetSourceTextFolderFilesTime('taffc', hours).subscribe(
    (response: FileData[]) => {
      this.processTAFsResponse(response, allTAFs);
    }
  );

  this.apiService.GetSourceTextFolderFilesTime('tafft', hours).subscribe(
    (response: FileData[]) => {
      this.processTAFsResponse(response, allTAFs);
    }
  );
}

private processTAFsResponse(response: FileData[], allTAFs: { [icao: string]: string }) {
  this.TAFArray = [...this.TAFArray, ...response];

  if (response.length > 0) {
    this.updateTime(response[0].lastmodified);
  }

  response.forEach(file => {
    const matches = file.filecontent.match(/TAF\s+[A-Z]{4}[\s\S]*?=/g);
    if (matches) {
      matches.forEach(entry => {
        const icao = entry.match(/TAF\s+([A-Z]{4})/)?.[1];
        if (icao) {
          allTAFs[icao] = entry.trim();
        }
      });
    }
  });

  this.groupTAFsByProvince(allTAFs);
  this.spinner.hide();
}
getAirportHeading(taf: string): string {
  const code = taf.split(' ')[1];
  const airportName = this.airportNames[code] || 'Unknown Airport';
  return `${code} - ${airportName}`;
}


}
