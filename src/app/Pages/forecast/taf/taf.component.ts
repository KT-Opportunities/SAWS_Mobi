import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { ViewDecodedPage } from '../../view-decoded/view-decoded.page';
import { DatePipe } from '@angular/common';
import { Platform } from '@ionic/angular';
import { MediaMatcher } from '@angular/cdk/layout';
import { Keyboard } from '@capacitor/keyboard';
import { ViewColorCodedStylePage } from '../../Pages/view-color-coded-style/view-color-coded-style.page';


interface FileData {
  foldername: string;
  filename: string;
  lastmodified: string;
  filecontent: string;
}

@Component({
  selector: 'app-taf',
  templateUrl: './taf.component.html',
  styleUrls: ['./../forecast.page.scss'],
})
export class TafComponent implements OnInit, OnDestroy {
  loading = false;
  TAFArray: FileData[] = [];
  groupedTAFs: { [province: string]: string[] } = {};
  searchQuery: string = '';
  currentDate?: string;
  currentTime?: string;
  objectKeys = Object.keys;
  viewModes: { [province: string]: 'normal' | 'color' } = {};
    item: any;

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


  constructor(
    private router: Router,
    private apiService: APIService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

 ngOnInit(): void {
  this.spinner.show();
 // Start with an empty combined array and taf map
this.TAFArray = [];
const allTAFs: { [icao: string]: string } = {};

this.apiService.GetSourceTextFolderFilesTime('taffc', 72).subscribe(
  (response: FileData[]) => {
    this.TAFArray = [...this.TAFArray, ...response];

    if (response.length > 0) {
      this.updateTime(response[0].lastmodified); // 👈 set currentDate & currentTime
    }

    response.forEach(file => {
      const matches = file.filecontent.match(/TAF\s+[A-Z]{4}[\s\S]*?=/g);
      if (matches) {
        matches.forEach(entry => {
          const match = entry.match(/TAF\s+([A-Z]{4})/);
          const icao = match?.[1];
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
this.apiService.GetSourceTextFolderFilesTime('tafft', 72).subscribe(
  (response: FileData[]) => {
    this.TAFArray = [...this.TAFArray, ...response];

    if (response.length > 0) {
      this.updateTime(response[0].lastmodified); // 👈 set currentDate & currentTime
    }

    response.forEach(file => {
      const matches = file.filecontent.match(/TAF\s+[A-Z]{4}[\s\S]*?=/g);
      if (matches) {
        matches.forEach(entry => {
          const match = entry.match(/TAF\s+([A-Z]{4})/);
          const icao = match?.[1];
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

  ngOnDestroy(): void {}

 
  ImageViewer(item: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '80%';
    dialogConfig.height = '80%';
    dialogConfig.data = { item };
    this.dialog.open(ViewDecodedPage, dialogConfig);
  }

  onSearch(event: Event) {
    event.preventDefault();
    this.searchQuery = this.searchQuery.trim();
  }

  updateTime(date?: string) {
    this.currentDate = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
    this.currentTime = this.datePipe.transform(date, 'HH:mm:ss') || '';
  }
   forecastPageNavigation() {
    this.router.navigate(['/forecast']);
  }
    ScrollToTop(value: any) {
    var element = document.getElementById(value);
    element?.scrollIntoView({ behavior: 'smooth' });
  }
 extractHeadingContent(filecontent: string): string {
    const match = filecontent.match(/TAF[\s\S]*?(?=TEMPO|$)/);
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
  
}