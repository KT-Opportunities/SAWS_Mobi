
import { DatePipe } from '@angular/common';
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
    filecontent: string;
    formatted?: string;
    heading?: string;
}

@Component({
    selector: 'app-warnings',
    templateUrl: './warnings.component.html',
    styleUrls: ['./../forecast.page.scss'],
})
export class WarningsComponent implements OnInit {
    loading = false;
    isLogged: boolean = false;
    WarningList: FileData[] = [];
    currentDate: string | undefined;
    currentTime: string | undefined;
    constructor(
        private router: Router,
        private authService: AuthService,
        private elRef: ElementRef,
        private iab: InAppBrowser,
        private spinner: NgxSpinnerService,
        private apiService: APIService,
        private dialog: MatDialog,
         private datePipe: DatePipe
    ) { }

    ngOnInit() {
        this.spinner.show();
         this.updateTime(new Date().toISOString());
        this.apiService.GetSourceTextFolderFiles('warnings').subscribe((response) => {
            this.WarningList = response
                .map((file: FileData) => {
                    const result = this.formatWarning(file);
                    if (result === null) return null; 
                    const { formatted, heading } = result;
                    return { ...file, formatted, heading };
                })
                .filter((w: FileData | null) => w !== null) as FileData[]; 
            this.spinner.hide();
        });
    }
    updateTime(date: string) {
    this.currentDate = this.datePipe.transform(date, 'yyyy - MM - dd') ?? '';
    this.currentTime = this.datePipe.transform(date, 'HH:mm:ss') ?? '';
  }
formatWarning(file: FileData): { formatted: string; heading: string } | null {
    if (!file.filecontent) return null;
    if (!file.filecontent.includes('WOZA')) return null; 

    // Normalize newlines and remove control characters
    let content = file.filecontent
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/[\x00-\x1F\x7F]/g, '');

    // Find the first ICAO + timestamp (FA.. 6 digits)
    const matchICAO = content.match(/(FA[A-Z]{2}\s*\d{6})/);
    if (!matchICAO) return null;

    // Trim content **after** the ICAO+timestamp
    content = content.substring((matchICAO.index! + matchICAO[0].length)).trim();

    const lines = content.split('\n').filter((l) => l.trim() !== '');

    // Build heading from the match
    let heading = '';
    const match = matchICAO[0].match(/(FA[A-Z]{2})\s*(\d{6})/);
    if (match) {
        const icao = match[1];
        const timeRaw = match[2];
        const hour = timeRaw.substring(0, 2);
        const minute = timeRaw.substring(2, 4);
        const formattedTime = `${hour}:${minute}`;
        const fileDate = new Date(file.lastmodified);
        const year = fileDate.getFullYear();
        const month = String(fileDate.getMonth() + 1).padStart(2, '0');
        const day = String(fileDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}${month}${day}`;
        heading = `WARNING FOR ${icao} - ${formattedDate} ${formattedTime}`;
    }

    console.log('Trimmed content preview:', content.substring(0, 200).replace(/\n/g, '\\n'));
    return { formatted: content, heading };
}



    forecastPageNavigation() {
        this.router.navigate(['/forecast']);
    }
}