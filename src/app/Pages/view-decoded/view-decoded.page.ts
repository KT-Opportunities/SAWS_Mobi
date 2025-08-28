import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
interface DecodedTAF {
  station: string;
  observationTime?: string;
  validFrom?: string;
  validTo?: string;
  wind?: string;
  visibility?: string;
  clouds?: string;
  weather?: string;
  maxTemp?: string;
  minTemp?: string;
  changes?: {
    type: string; // BECMG / FM / TEMPO / PROB
    from?: string;
    to?: string;
    wind?: string;
    visibility?: string;
    clouds?: string;
    weather?: string;
    probability?: string;
  }[];
}

@Component({
  selector: 'app-view-decoded',
  templateUrl: './view-decoded.page.html',
  styleUrls: ['./view-decoded.page.scss'],
})
export class ViewDecodedPage implements OnInit {
decodedTAF!: DecodedTAF;
  constructor(
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<ViewDecodedPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
   
    console.log('MAT_DIALOG_DATA:', this.data);
      if (data?.item && typeof data.item === 'string') {
      this.decodedTAF = this.parseTAF(data.item);
    } else {
      console.error('Invalid TAF data', data);
      this.decodedTAF = { station: '', changes: [] };
    }

  }

  ngOnInit() {}

  closeImageDialog() {
    this.dialogRef.close('close');
  }

   parseTAF(taf: string): DecodedTAF {
    if (!taf) return { station: '', changes: [] };

    // Split into tokens
    const tokens = taf.replace(/\r?\n/g, ' ').split(/\s+/).filter(t => t);

    // Station (FAOR, FALA, etc.)
    const station = tokens[1] || '';

    // Observation time: 020406Z
    const obsToken = tokens.find(t => /^\d{6}Z$/.test(t)) || '';
    const observationTime = obsToken
      ? `Day ${obsToken.substr(4, 2)} ${obsToken.substr(2, 2)}:00`
      : '';

    // Valid period: 0206/0312
    const validToken = tokens.find(t => /^\d{4}\/\d{4}$/.test(t)) || '';
    const validFrom = validToken
      ? `Day ${validToken.substr(0, 2)} ${validToken.substr(2, 2)}:00`
      : '';
    const validTo = validToken
      ? `Day ${validToken.substr(5, 2)} ${validToken.substr(7, 2)}:00`
      : '';

    // Wind and visibility
    const wind = tokens.find(t => /^\d{3}\d{2}KT$/.test(t) || /^VRB\d{2}KT$/.test(t)) || '';
    const visibility = tokens.find(t => t === 'CAVOK') || '';

    // Max/Min temperatures
    const txToken = tokens.find(t => t.startsWith('TX')) || '';
    const tnToken = tokens.find(t => t.startsWith('TN')) || '';
    const maxTemp = txToken ? txToken.replace('TX', '') : '';
    const minTemp = tnToken ? tnToken.replace('TN', '') : '';

    // Changes (BECMG, FM, TEMPO, PROB)
    const changes: any[] = [];
    let current: any = null;

    tokens.forEach(token => {
      if (['BECMG', 'FM', 'TEMPO', 'PROB'].includes(token)) {
        if (current) changes.push(current);
        current = { type: token };
        return;
      }
      if (!current) return;
      if (!current.from && /^\d{6}$/.test(token)) current.from = token;
      else if (!current.to && /^\d{6}$/.test(token)) current.to = token;
      else if (!current.wind && (/^\d{3}\d{2}KT$/.test(token) || /^VRB\d{2}KT$/.test(token))) current.wind = token;
      else if (!current.visibility && token === 'CAVOK') current.visibility = token;
    });

    if (current) changes.push(current);

const stations: { [icao: string]: string } = {
  // Gauteng
  FAOR: 'O R Tambo Intl, South Africa 2609S 0281348E',
  FALA: 'Lanseria Intl, South Africa 2640S 02756E',
  FAJB: 'Barberspan, South Africa',
  FAIR: 'Randfontein, South Africa',
  FAWB: 'Rand Airport, South Africa 2608S 02814E',
  FAWK: 'Krugersdorp Airfield, South Africa 2624S 02743E',
  FAGC: 'Germiston, South Africa',
  FAGM: 'Magaliesburg, South Africa',
  FASI: 'Siyabuswa, South Africa',
  FAVV: 'Vereeniging, South Africa',

  // Limpopo
  FAPP: 'Polokwane Intl, South Africa 2325S 02925E',
  FALM: 'Lephalale, South Africa 2347S 02741E',
  FAHS: 'Hoedspruit, South Africa 2475S 03104E',
  FATH: 'Thohoyandou, South Africa',
  FATV: 'Tzaneen, South Africa',
  FAER: 'Ellisras, South Africa',
  FATZ: 'Tzaneen/Zebediela, South Africa',
  FATI: 'Tshipise, South Africa',
  FAVM: 'Vhembe, South Africa',

  // Mpumalanga
  FAKN: 'Nelspruit/Kruger Mpumalanga Intl, South Africa 2502S 03106E',
  FANS: 'Nooitgedacht, South Africa',
  FAEO: 'Ermelo, South Africa',
  FASR: 'Secunda, South Africa',
  FAWI: 'Witbank, South Africa',
  FAKP: 'Kaapmuiden, South Africa',
  FASZ: 'Standerton, South Africa',

  // Northwest Province
  FAMM: 'Mafikeng, South Africa 2534S 02636E',
  FALI: 'Lichtenburg, South Africa',
  FAKD: 'Klerksdorp, South Africa',
  FARG: 'Rustenburg, South Africa',
  FAPN: 'Pilanesberg, South Africa 2554S 02703E',
  FAPS: 'Potchefstroom, South Africa',
  FAMK: 'Mahikeng, South Africa',

  // Western Cape
  FACT: 'Cape Town Intl, South Africa 3357S 01835E',
  FAGG: 'George, South Africa 3340S 02203E',
  FALW: 'Langebaanweg, South Africa',
  FAOB: 'Oudtshoorn, South Africa',
  FABY: 'Barrydale, South Africa',
  FAPG: 'Piketberg, South Africa',
  FAYP: 'Yzerfontein, South Africa',
  FAOH: 'Oudshoorn, South Africa',

  // Eastern Cape
  FAPE: 'Port Elizabeth Intl, South Africa 3350S 02536E',
  FAEL: 'East London Intl, South Africa 3313S 02753E',
  FAUT: 'Mthatha, South Africa 3105S 02848E',
  FABE: 'Bisho, South Africa',

  // KwaZulu Natal
  FALE: 'King Shaka Intl, South Africa 2955S 03105E',
  FAPM: 'Pietermaritzburg, South Africa 2937S 03024E',
  FARB: 'Richards Bay, South Africa 2839S 03205E',
  FAMG: 'Margate, South Africa',
  FAVG: 'Vryheid, South Africa',
  FAGY: 'Empangeni, South Africa',
  FAUL: 'Ulundi, South Africa',
  FALY: 'Ladysmith, South Africa',
  FANC: 'Newcastle, South Africa',
  FAMX: 'Madadeni, South Africa',

  // Freestate
  FABL: 'Bloemfontein, South Africa 2928S 02615E',
  FABM: 'Bethlehem, South Africa',
  FAWM: 'Welkom, South Africa',
  FAHV: 'Harrismith, South Africa',
  FAKS: 'Kroonstad, South Africa',
  FAFB: 'Frankfort, South Africa',

  // Northern Cape
  FAUP: 'Upington, South Africa 2815S 02114E',
  FAKM: 'Kuruman, South Africa 2717S 02327E',
  FADY: 'De Aar, South Africa',
  FACV: 'Carnavon, South Africa',
  FASB: 'Springbok, South Africa',
  FAAB: 'Alexander Bay, South Africa',
  FASS: 'Sutherland, South Africa',

  // Lesotho
  FXMM: 'Maseru, Lesotho 2928S 02730E',

  // Eswatini
  FDMS: 'Matsapha, Eswatini 2652S 03133E',
  FDSK: 'Sikhuphe, Eswatini 2654S 03138E',

  // Botswana
  FBSK: 'Sir Seretse Khama Intl, Botswana 2439S 02555E',
  FBMN: 'Maun, Botswana 1921S 02326E',
  FBFT: 'Francistown, Botswana',
  FBGZ: 'Ghanzi, Botswana',
  FBJW: 'Jwaneng, Botswana',
  FBKE: 'Kasane, Botswana 1726S 02510E',
  FBMP: 'Mapoka, Botswana',
  FBPA: 'Palapye, Botswana',
  FBTE: 'Tsabong, Botswana',
  FBTS: 'Tshane, Botswana',
  FBSN: 'Shakawe, Botswana',
  FBSP: 'Sowa, Botswana',
  FBSW: 'Selibe Phikwe, Botswana',
  FBLT: 'Letlhakane, Botswana',

  // Namibia
  FYWH: 'Windhoek, Namibia 2240S 01706E',
  FYWE: 'Walvis Bay, Namibia 2233S 01430E',
  FYKM: 'Keetmanshoop, Namibia 2720S 01803E',
  FYKT: 'Katima Mulilo, Namibia 1735S 02417E',
  FYWB: 'Witbank, Namibia 2502S 03103E',
  FYGF: 'Grunau, Namibia 2833S 01852E',
  FYLZ: 'Lüderitz, Namibia 2643S 01514E',
  FYOA: 'Oranjemund, Namibia 2642S 01628E',
  FYOG: 'Ongwediva, Namibia 1731S 01642E',
  FYRU: 'Rundu, Namibia 1739S 01955E',

  // Mozambique
  FQMA: 'Maputo Intl, Mozambique 2555S 03234E',
  FQBR: 'Beira, Mozambique 1931S 03451E',
  FQNP: 'Nampula, Mozambique 1501S 03915E',
  FQIN: 'Inhambane, Mozambique 2332S 03523E',
  FQLC: 'Lichinga, Mozambique 1345S 03640E',
  FQPB: 'Pemba, Mozambique 1229S 04032E',
  FQQL: 'Quelimane, Mozambique 1757S 03652E',
  FQTE: 'Tete, Mozambique',
  FQTT: 'Tete, Mozambique',
  FQVL: 'Vilanculos, Mozambique',

  // Zimbabwe
  FVRG: 'Harare, Zimbabwe 1750S 03105E',
  FVJN: 'Jwaneng, Zimbabwe 2000S 02800E',
  FVKB: 'Kariba, Zimbabwe',
  FVFA: 'Victoria Falls, Zimbabwe 1750S 02550E',
  FVCZ: 'Cecil Z., Zimbabwe',
  FVTL: 'Tuli Lodge, Zimbabwe',
  FVWN: 'Hwange, Zimbabwe',

  // Other Regions
  FWKI: 'Kigali, Rwanda 0139S 03005E',
  FWCL: 'Cape Town Intl, South Africa 3357S 01835E',
  FLKK: 'Kasane, Botswana 1726S 02510E',
  FLSK: 'Skukuza, South Africa 2505S 03133E',
  FNLU: 'Lusaka, Zambia 1528S 02817E',
  FLHN: 'Hondeklip Bay, South Africa 2921S 01710E',
  FLND: 'No data station',
  FAME: 'No data station',
};

    return {
      station: `${station} ${stations[station] || ''}`,
      observationTime,
      validFrom,
      validTo,
      wind,
      visibility,
      maxTemp,
      minTemp,
      changes,
    };
  }

}
