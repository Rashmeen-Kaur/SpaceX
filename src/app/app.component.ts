import { Component } from '@angular/core';
import { AppService } from './app.service';
import * as _ from 'underscore';
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'spaceX';
  responseData = [];
  spaceXList: any = [];
  launchYears: any = [];
  launchState: any;
  spaceXListCount = 0;
  landState: string = "";
  year: string = "";
  constructor(private appService: AppService, private router: Router) { }

  ngOnInit() {
    console.log("Hello");

    this.appService.getAllSpaceX().subscribe(
      res => {
        //Parsing the response res
        this.responseData = JSON.parse(JSON.stringify(res));
        if (this.responseData.length > 0) {
          this.spaceXListCount = this.responseData.length;
          for (let i = 0; i < this.responseData.length; i++) {
            var parsedData = JSON.parse(JSON.stringify(this.responseData[i]));
            console.log("res of is , ", parsedData)
            this.spaceXList.push(parsedData)
          }
          //Storing launch years in local array
          var arr = this.spaceXList.map(function (res: any) {
            return res.launch_year
          })
          //Removing duplicate years
          this.launchYears = arr.filter(function (elem: any, index: any, self: any) {
            return index === self.indexOf(elem);
          })
          //Sorting the years
          this.launchYears.sort(
            function (a: string, b: string) {
              return parseInt(a) - parseInt(b)
            }
          )
          console.log("Years are ", this.launchYears);
        } else {
          this.spaceXListCount = 0;
        }

      }, (err) => {
        console.log(err);

      }
    );
  }


  // Filtering on the basis of launch_success
  filterLaunches(event: any) {
    this.launchState = event.target.textContent.toLowerCase();
    this.appService.getSpaceXLaunch(this.launchState).subscribe((res) => {
      this.spaceXList = res;
      this.spaceXListCount = res.length;
    });
  }

  // Filtering on the basis of launch_year
  filterYear(year: any) {
    this.appService.getAllSpaceX().subscribe((res: any) => {
      this.spaceXList = res.filter(function (elem: any) {
        return elem.launch_year == year;
      })
    });
  }


  // Filtering on the basis of different conditions
  filterLand(event: any) {
    this.landState = event.target.textContent.toLowerCase();

    if (this.launchState != "" && this.landState != "" && this.year == "") {
      this.appService.getLaunchLand(this.launchState, this.landState).subscribe((res) => {
        this.spaceXList = res;
        this.spaceXListCount = res.length;
      });
    } else if (this.launchState != "" && this.landState != "" && this.year != "") {
      this.appService.getAllSpaces(this.year, this.launchState, this.landState).subscribe((res: any) => {
        this.spaceXList = res;
        this.spaceXListCount = res.length;
        return;
      });
    } else {
      this.appService.getAllSpaceX().subscribe((res: any) => {
        var land_status = this.landState;
        this.spaceXList = res.filter(function (elem: any) {
          return elem.rocket.first_stage.cores[0].land_success == land_status;
        })
        this.spaceXList = res;
        this.spaceXListCount = res.length;
        return;
      });
    }
  }

  // Resetting all the filters

  resetFilters() {
    this.appService.getAllSpaceX().subscribe((res: any) => {
      this.spaceXList = [];
      this.spaceXListCount = res.length;
      for (let i = 0; i < this.responseData.length; i++) {
        var parsedData = JSON.parse(JSON.stringify(this.responseData[i]));
        console.log("res of is , ", parsedData)
        this.spaceXList.push(parsedData)
      }
      return;
    });
  }


}


