import { Component, OnInit } from '@angular/core';
import {APIService} from './../../services/apis.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { textFile } from '../Advisories/advisories.component';
@Component({
  selector: 'app-sigmet-airmet',
  templateUrl: './sigmet-airmet.component.html',
  styleUrls: ['./sigmet-airmet.component.scss'],
})
export class SigmetAirmetComponent  implements OnInit {

  isLoading:boolean = true;
  SigmetList:any = [];
  AirmetList:any = [];
  constructor(private api:APIService) { }

  ngOnInit() {
    this.api.GetSourceTextFolderFiles("sigmet")
    .subscribe((Response) => {
      Response.forEach((element:any) => {
        element.Id = element.filetextcontent.split('\n')[2];
        if(element.Id.split(' ')[0] == 'VA'){
          var vwValue = element.filetextcontent.split('\n')[5];
          element.heading = vwValue;
          vwValue = vwValue.split('VOLCANO: ')[1];
          if(vwValue == undefined){
            vwValue = element.filetextcontent.split('\n')[5];
          }
          var obj = { value: element.filetextcontent.split('\n')[0], viewValue:vwValue}
          element.Id = element.filetextcontent.split('\n')[0];
        }
        // if(element.Id.split(' ')[0] == 'TC'){
        //   debugger
        //   var vwValue = element.filetextcontent.split('\n')[5]
        //   element.heading = vwValue;
        //   vwValue = vwValue.split('TC:')[1].trim();
        //   var obj = { value: element.filetextcontent.split('\n')[0], viewValue:vwValue}
        //   this.CycloneList.push(obj);
        //   element.Id = element.filetextcontent.split('\n')[0];
        // }
      });
      this.SigmetList = Response;
      console.log("Response ", this.SigmetList);
      debugger
      this.isLoading = false;
      
    })
  }

}
