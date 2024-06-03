import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { APIService } from 'src/app/services/apis.service';
@Component({
  selector: 'app-metar-maps',
  templateUrl: './metar-maps.component.html',
  styleUrls: ['./../domestic.page.scss'],
})
export class MetarMapsComponent implements OnInit {
  imageUrl: string | null = null;
  isLogged: boolean = false;
  isLoading: boolean = true;
  MetarMaps: any = [];
  fileBaseUrlSynoptic: SafeResourceUrl = '';

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
    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.loadSynopticData();
    }
  }

  loadSynopticData() {
  
    this.isLoading = true;
    this.APIService.GetSourceAviationFolderFilesListNull(24).subscribe(
      (data) => {
        this.MetarMaps = data.filter(
          (item: any) => item.filename === 'CP000_None_SOUTH_AFRICA_SAWS.png'
        );
        console.log('METARMAPS', this.MetarMaps);
        if (this.MetarMaps.length > 0) {
          this.loadImage(this.MetarMaps[0].filename);
        } else {
          this.isLoading = false;
        }
      },
      (error) => {
        console.error('Error fetching JSON data:', error);
        this.isLoading = false;
      }
    );
  }

  loadImage(filename: string) {
    this.APIService.GetAviationFile('', filename).subscribe(
      (data) => {
        const imageUrlSynoptic =
          'data:image/png;base64,' + data.filetextcontent;
        this.fileBaseUrlSynoptic =
          this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlSynoptic);
        this.isLoading = false;
        this.cdr.detectChanges(); // Trigger change detection
      },
      (error) => {
        console.error('Error fetching image data:', error);
        this.isLoading = false;
      }
    );
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  Domestic() {
    this.router.navigate(['/domestic']);
  }
}
