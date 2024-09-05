import {
  Component,
  OnInit,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-synoptic-analysis',
  templateUrl: './synoptic-analysis.page.html',
  styleUrls: ['./synoptic-analysis.page.scss'],
})
export class SynopticAnalysisPage implements OnInit {
  imageUrl: string | null = null;
  isLogged: boolean = false;
  loading: boolean = true;
  Synoptic: any = [];
  fileBaseUrlSynoptic: SafeResourceUrl = '';
  rotationDegree = 0;
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
    this.loading = true;
    this.APIService.GetSourceAviationFolderFilesListNull(24).subscribe(
      (data) => {
        this.Synoptic = data.filter(
          (item: any) => item.filename === 'synoptic.png'
        );
        if (this.Synoptic.length > 0) {
          this.loadImage(this.Synoptic[0].filename);
        } else {
          this.loading = false;
        }
      },
      (error) => {
        console.error('Error fetching JSON data:', error);
        this.loading = false;
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
        this.loading = false;
        this.cdr.detectChanges(); // Trigger change detection
      },
      (error) => {
        console.error('Error fetching image data:', error);
        this.loading = false;
      }
    );
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  rotateImage(): void {
    this.rotationDegree += 90;
    if (this.rotationDegree >= 360) {
      this.rotationDegree = 0;
    }
  }
  NavigateToAerosport() {
    this.router.navigate(['/aero-sport']);
  }
}
