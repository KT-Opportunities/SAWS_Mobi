import { Component, OnInit } from '@angular/core';
import {APIService} from '../../../services/apis.service'
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
  GametList:any = [];
  unfilteredList:any = [];
  constructor(private api:APIService) { }

  ngOnInit() {
    // this.api.GetSourceTextFolderFiles("sigmet")
    // .subscribe((Response) => {
    //   Response.forEach((element:any) => {
    //     element.Id = element.filetextcontent.split('\n')[2];
       
    //       var vwValue = element.filetextcontent.split('\n')[2];
    //       element.heading = vwValue;
         
    //       // var obj = { value: element.filetextcontent.split('\n')[0], viewValue:vwValue}
    //       // element.Id = element.filetextcontent.split('\n')[0];
        
    //     // if(element.Id.split(' ')[0] == 'TC'){
    //     //   debugger
    //     //   var vwValue = element.filetextcontent.split('\n')[5]
    //     //   element.heading = vwValue;
    //     //   vwValue = vwValue.split('TC:')[1].trim();
    //     //   var obj = { value: element.filetextcontent.split('\n')[0], viewValue:vwValue}
    //     //   this.CycloneList.push(obj);
    //     //   element.Id = element.filetextcontent.split('\n')[0];
    //     // }
    //   });
    //   this.SigmetList = Response;
    //   this.unfilteredList = Response;
    //   console.log("Response ", this.SigmetList);
    //   debugger
    //   this.isLoading = false;
      
    // })
    debugger;
    this.getSigmetTextFiles();
  }

 async getSigmetTextFiles(){
  await this.api.GetSourceTextFolderFiles("sigmet")
    .subscribe((Response) => {
      
      Response.forEach((element:any) => {
        element.Id = element.filetextcontent.split('\n')[2];
       
          var vwValue = element.filetextcontent.split('\n')[2];
          element.heading = vwValue;
         
      });
      this.SigmetList = Response;
      this.unfilteredList = Response;
      this.getAirmetTextFiles();
      console.log("Response ", this.SigmetList);
      debugger
      // this.isLoading = false;
      
    })
  }
 async getAirmetTextFiles(){
  debugger
    await this.api.GetSourceTextFolderFiles("airmet")
    .subscribe((Response) => {
      
      Response.forEach((element:any) => {
        element.Id = element.filetextcontent.split('\n')[2];
       
          var vwValue = element.filetextcontent.split('\n')[2];
          element.heading = vwValue;
         
      });

      //Push airmet into the sigmet List
      this.SigmetList.push(Response);
      this.unfilteredList.push(Response);
      console.log("Response ", this.SigmetList);
      debugger
      this.getGametTextFiles();
      
    })
  }
  async getGametTextFiles(){
    debugger
   await this.api.GetSourceTextFolderFiles("gamet")
    .subscribe((Response) => {
      
      Response.forEach((element:any) => {
        element.Id = element.filetextcontent.split('\n')[2];
       
          var vwValue = element.filetextcontent.split('\n')[2];
          element.heading = vwValue;
         
      });
      //push gamet into the sigmet List
      this.SigmetList.push(Response);
      this.unfilteredList.push(Response);
      console.log("Response ", this.SigmetList);
      debugger
      this.isLoading = false;
      
    })
  }
  
  filterbySearch(event: Event){
    debugger

    let element = document.getElementById('searchValue');
    console.log("value ",element);
    let filterValue = (element as HTMLInputElement).value;
    if (!filterValue) {
      this.SigmetList = this.unfilteredList;
      return;
    }
  
    this.SigmetList = this.SigmetList.filter(
    (a:any) => a.filetextcontent?.toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  filterNosearchValue(){
    debugger

    let element = document.getElementById('searchValue');
    console.log("value ",element);
    let filterValue = (element as HTMLInputElement).value;
    if (!filterValue) {
      this.SigmetList = this.unfilteredList;
      return;
    }
  }

  ScrollToTop(value: any) {
    debugger;
    var element = document.getElementById(value);
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  forecastPage() {
    window.history.back();
    // this.router.navigate(['/forecast']);
  }

}
