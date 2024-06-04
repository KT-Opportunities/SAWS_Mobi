import { Component, OnInit } from '@angular/core';
import {APIService} from '../../../services/apis.service'
@Component({
  selector: 'app-sigmet-gamet',
  templateUrl: './sigmet-gamet.component.html',
  // styleUrls: ['./sigmet-gamet.component.scss'],
  styleUrls: ['./../forecast.page.scss'],
})
export class SigmetGametComponent  implements OnInit {

  constructor(private api:APIService) { }

  isLoading:boolean = true;
  SigmetList:any = [];
  AirmetList:any = [];
  GametList:any = [];
  unfilteredList:any = [];

  ngOnInit() {
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
       
        // this.isLoading = false;
        
      })
    }

    async getAirmetTextFiles(){
     
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
         
          this.getGametTextFiles();
          
        })
      }

      async getGametTextFiles(){
      
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
         
          this.isLoading = false;
          
        })
      }

      filterbySearch(event: Event){
     
    
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
       
    
        let element = document.getElementById('searchValue');
        console.log("value ",element);
        let filterValue = (element as HTMLInputElement).value;
        if (!filterValue) {
          this.SigmetList = this.unfilteredList;
          return;
        }
      }
      ScrollToTop(value: any) {
        
        var element = document.getElementById(value);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    
      forecastPage() {
        window.history.back();
        // this.router.navigate(['/forecast']);
      }



}

