import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { APIService } from '../../../services/apis.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

export interface textFile {
  foldername: string;
  filename: string;
  lastmodified: string;
  filecontent: string;
}
@Component({
  selector: 'app-advisories',
  templateUrl: './advisories.component.html',
  // styleUrls: ['./advisories.component.scss'],
  styleUrls: ['./../forecast.page.scss'],
})
export class AdvisoriesComponent implements OnInit {
  isLoading: boolean = true;
  AdvisoriesList: any = [];
  AdvisoriesList1: any =[];
  VolcanoList: any = [];
  CycloneList: any = [];
  swxcList: any = [];
  filter: any;
  filter2: any;
  fullVolcanoAdvisories: any[] = [];
fullCycloneAdvisories: any[] = [];

 
  constructor(
    private api: APIService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event: any): void {
    this.scrollBuytton();
  }

  ngOnInit() {
    // ✅ Volcano Name → Smithsonian GVP ID Map
    const volcanoIdMap: { [key: string]: string | number } = {
      'SEMERU': 263300,
      'IBU': 268030,
      'DUKONO': 268010,
      'LEWOTOBI': 264180,
      'VOLCAN NEVADO DEL RUIZ': 351020,
      'REVENTADOR': 352010,
      'KILAUEA': 332010,
      'VESTMANNAEYJAR': 372010,
      'KLYUCHEVSKOY': 300030,
      'KANLAON': '1200-02',
      'SANGAY': 352030,
      'LEWOTOLOK': 264190
    };

    this.api.GetSourceTextFolderFiles('advisories').subscribe((Response) => {

      // Extract name between MT ... PSN and map to include ID
      this.VolcanoList = Response.map((item: any) => {
        const match = item.filecontent.match(/MT\s*(.*?)\s*PSN/);
        if (match) {
          const name = match[1].trim().toUpperCase();
          const id = volcanoIdMap[name];
          return id ? { text: `${name} ${id}` } : { text: name };
        }
        return null;
      }).filter((item: any) => item !== null);

      // ✅ Do NOT remove duplicates — keep them as they appear
      // Each advisory corresponds to one volcano event, even if repeated
  this.CycloneList = Response.map((item: any) => {
        const match = item.filecontent.match(/TROPICAL STORM\s+(.*?)\s+FORECAST\/ADVISORY NUMBER/i);
        if (match) {
          const name = match[1].trim().toUpperCase();
          const id = volcanoIdMap[name];
          return id ? { text: `${name} ${id}` } : { text: name };
        }
        return null;
      }).filter((item: any) => item !== null);
  this.AdvisoriesList = Response.filter((item: any) => {
  const isVolcano = /MT\s*(.*?)\s*PSN/.test(item.filecontent);

  return isVolcano 
});
  this.AdvisoriesList1 = Response.filter((item: any) => {

  const isCyclone = /TROPICAL STORM\s+(.*?)\s+FORECAST\/ADVISORY NUMBER/i.test(item.filecontent);
  return  isCyclone;
});
this.fullVolcanoAdvisories = Response.filter((item:any)=> /MT\s*(.*?)\s*PSN/.test(item.filecontent));
this.fullCycloneAdvisories = Response.filter((item:any) => /TROPICAL STORM\s+(.*?)\s+FORECAST\/ADVISORY NUMBER/i.test(item.filecontent));
      console.log('Full VolcanoList with IDs:', this.AdvisoriesList1);
      this.isLoading = false;
      this.spinner.hide();
    });

    // Scroll to top button visibility logic
    document.addEventListener('scroll', () => {
      var Topbutton = document.getElementById('btntotop');
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        Topbutton!.style.display = 'block';
      } else {
        Topbutton!.style.display = 'none';
      }
    });
  }

  // updateTime(date: string ) {
  //   this.currentDate =
  //     this.datePipe.transform(date, 'yyyy - MM - dd') ?? '2024 - 01 - 22';
  //   this.currentTime = this.datePipe.transform(date, 'HH:mm:ss') ?? '13:15:45';
  // }

ScrollToFilter(event: any, type: string) {
  const value = event.target.value;

  if (type === 'volcano') {
    this.AdvisoriesList = value === 'all'
      ? [...this.fullVolcanoAdvisories]
      : this.fullVolcanoAdvisories.filter(item => {
          const match = item.filecontent.match(/MT\s*(.*?)\s*PSN/);
          return match && match[1].trim().toUpperCase() === value;
        });
  }

  if (type === 'cyclone') {
    this.AdvisoriesList1 = value === 'all'
      ? [...this.fullCycloneAdvisories]
      : this.fullCycloneAdvisories.filter(item => {
          // Use same regex as CycloneList creation
          const match = item.filecontent.match(/TROPICAL STORM\s+(.*?)\s+FORECAST\/ADVISORY NUMBER/i);
          // Check if the match exists and equals the selected filter
          return match && match[1].trim().toUpperCase() === value;
        });
  }
}



  ScrollToTop(value: any) {
    var element = document.getElementById(value);
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollBuytton() {
    let buttoTop = document.getElementById('btntotop');
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      buttoTop!.style.display = 'block';
    } else {
      buttoTop!.style.display = 'none';
    }
  }

  forecastPageNavigation() {
    window.history.back();
    this.router.navigate(['/forecast']);
  }
}
