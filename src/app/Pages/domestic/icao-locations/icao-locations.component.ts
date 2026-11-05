import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';
import { IcaoModalComponent } from './icao-modal/icao-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-icao-locations',
  templateUrl: './icao-locations.component.html',
  // styleUrls: ['./icao-locations.component.scss'],
  styleUrls: ['./../domestic.page.scss'],
})
export class IcaoLocationsComponent  implements OnInit {

  isLogged: boolean = false;
  loading: boolean = false;
icaoLocations = [
  { icao: 'FAAB', name: 'Alexander Bay/Alexander Bay', metar: 'FAAB 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAAD', name: 'Adelaide/Adelaide', metar: 'FAAD 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAAE', name: 'Aberdeen/Aberdeen', metar: 'FAAE 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAAF', name: 'Andrew S Field Airpo/Andrew S Field', metar: 'FAAF 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAAG', name: 'Aggeneys Airport/Aggeneys', metar: 'FAAG 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAAK', name: 'Askham/Askham', metar: 'FAAK 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAAL', name: 'Alldays/Alldays', metar: 'FAAL 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAAM', name: 'Mbabane/Amsterdam', metar: 'FAAM 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAAN', name: 'Aliwal North/Aliwal North', metar: 'FAAN 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAAP', name: 'Arnot Power Station/Arnot Power Station', metar: 'FAAP 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAAR', name: 'Arathusa Safari Lodge/Arathusa', metar: 'FAAR 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAAS', name: 'Ashton/Ashton', metar: 'FAAS 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FABA', name: 'Bapsfontein/Bapsfontein', metar: 'FABA 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FABN', name: 'Barberton/Barberton', metar: 'FABN 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FABF', name: 'Barkley East/Barkley East', metar: 'FABF 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FABX', name: 'Beatrix Mine/Beatrix Mine', metar: 'FABX 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FABW', name: 'Beaufort West/Beaufort West', metar: 'FABW 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FABF', name: 'Bedford/Bedford', metar: 'FABF 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FABH', name: 'Bethal/Bethal', metar: 'FABH 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FABT', name: 'Bethesda Road/Bethesda Road', metar: 'FABT 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FABM', name: 'Bethlehem/Bethlehem', metar: 'FABM 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FABE', name: 'Bisho/Bisho', metar: 'FABE 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FABZ', name: 'Bizana/Bizana', metar: 'FABZ 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FABL', name: 'Bloemfontein/Bloemfontein', metar: 'FABL 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FATP', name: 'Bloemfontein New Tempe/Bloemfontein New Tempe', metar: 'FATP 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FABK', name: 'Bloemhof/Bloemhof', metar: 'FABK 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FA03', name: 'Brandfort/Brandfort', metar: 'FA03 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FABV', name: 'Brandvlei/Brandvlei', metar: 'FABV 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FABR', name: 'Bredasdorp/Bredasdorp', metar: 'FABR 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FABS', name: 'Brits/Brits', metar: 'FABS 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FABP', name: 'Bultfontein James Viljoen/Bultfontein James Viljoen', metar: 'FABP 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FADN', name: 'Durban/Durban', metar: 'FADN 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAVG', name: 'Durban Virginia/Durban Virginia', metar: 'FAVG 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FADH', name: 'Durnacol/Durnacol', metar: 'FADH 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FADB', name: 'Dwaalboom/Dwaalboom', metar: 'FADB 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAEL', name: 'East London/East London', metar: 'FAEL 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAED', name: 'Edenburg/Edenburg', metar: 'FAED 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAEG', name: 'Egnep/Egnep', metar: 'FAEG 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FALQ', name: 'El Mirrador/El Mirrador', metar: 'FALQ 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAET', name: 'Elliot/Elliot', metar: 'FAET 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAER', name: 'Ellisras Mitimba/Ellisras Mitimba', metar: 'FAER 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAEM', name: 'Empangeni/Empangeni', metar: 'FAEM 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAEO', name: 'Ermelo/Ermelo', metar: 'FAEO 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAES', name: 'Eshowe/Eshowe', metar: 'FAES 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAEC', name: 'Estcourt/Estcourt', metar: 'FAEC 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAFB', name: 'Ficksburg/Ficksburg', metar: 'FAFB 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAFK', name: 'Fisantekraal/Fisantekraal', metar: 'FAFK 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAFG', name: 'Flamingo/Flamingo', metar: 'FAFG 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FA07', name: 'Forel/Forel', metar: 'FA07 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },
  { icao: 'FAFO', name: 'Fort Beaufort/Fort', metar: 'FA07 131100Z AUTO 27011KT ///// ///// 22/12 Q1016' },]
 

  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private APIService: APIService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
     private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      // fetch icao locations
    }
  }

  NavigateToDomestic() {
    this.router.navigate(['/domestic']);
  }


  openModal(item: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '80%';
    dialogConfig.height = '80%';
    dialogConfig.data = { item };
    this.dialog.open(IcaoModalComponent, dialogConfig);
  }

  ViewColorCodedStyle() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '80%';
    dialogConfig.height = '80%';
    const dialogRef = this.dialog.open(IcaoModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      this.loading = false;
    });
  }
}
