import { Component } from '@angular/core';
import { AppService } from './app.service';
import * as _ from 'underscore';

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
  launchState: any = "";
  spaceXListCount = 0;
  landState: string = "";
  year: string = "";
  flgActive: boolean = false;
  flgLandTrue: boolean = false;
  flgLandFalse: boolean = false;
  flgLaunchTrue: boolean = false;
  flgLaunchFalse: boolean = false;
  filteredYear: string = "";
  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.getAllSpaceX().subscribe(
      res => {
        //Parsing the response res
        this.responseData = JSON.parse(JSON.stringify(res));
        if (this.responseData.length > 0) {
          this.spaceXListCount = this.responseData.length;
          for (let i = 0; i < this.responseData.length; i++) {
            var parsedData = JSON.parse(JSON.stringify(this.responseData[i]));
            // console.log("res of is , ", parsedData)
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
          // console.log("Years are ", this.launchYears);
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
    var year = this.year;
    var land_status = this.landState;
    this.launchState = event.target.textContent.toLowerCase();
    if (this.launchState == 'true') {
      this.flgLaunchTrue = true;
      this.flgLaunchFalse = false;
    } else {
      this.flgLaunchFalse = true;
      this.flgLaunchTrue = false;
    }
    // console.log("inside filter year ", this.launchState, land_status, year)
    this.appService.getSpaceXLaunch(this.launchState).subscribe((res) => {
      // this.spaceXList = res;
      this.spaceXList = res.filter(function (elem: any) {
        if (year != "" && land_status != "") {
          return elem.launch_year == year && JSON.stringify(elem.rocket.first_stage.cores[0].land_success) === land_status;
        } else if (year != "") {
          return elem.launch_year == year
        } else if (land_status != "") {
          return JSON.stringify(elem.rocket.first_stage.cores[0].land_success) === land_status
        } else {
          return elem;
        }
      })
      // this.spaceXListCount = res.length;
      this.spaceXListCount = this.spaceXList.length;
    });
  }

  // Filtering on the basis of launch_year
  filterYear(year: any) {
    this.year = year;
    this.filteredYear = year;
    var land_status = this.landState;
    var launch_status = this.launchState;
    // console.log("inside filter year ", this.year, land_status, launch_status)
    this.appService.getAllSpaceX().subscribe((res: any) => {
      this.spaceXList = res.filter(function (elem: any) {
        if (land_status != "" && launch_status != "") {
          // console.log("Inside else if of year launch_status && land_status")
          return elem.launch_year == year && JSON.stringify(elem.rocket.first_stage.cores[0].land_success) === land_status && JSON.stringify(elem.launch_success) === launch_status;
        } else if (land_status == "" && launch_status != "") {
          // console.log("Inside else if of year launch_status")
          return elem.launch_year == year && JSON.stringify(elem.launch_success) === launch_status;
        } else if (land_status != "" && launch_status == "") {
          // console.log("Inside else if of year land_status")
          return elem.launch_year == year && JSON.stringify(elem.rocket.first_stage.cores[0].land_success) === land_status;
        } else {
          // console.log("Inside else of year")
          return elem.launch_year == year;
        }
      })
      this.spaceXListCount = this.spaceXList;
    });
  }


  // Filtering on the basis of different conditions
  filterLand(event: any) {

    this.landState = event.target.textContent.toLowerCase();
    if (this.landState == 'true') {
      this.flgLandTrue = true;
      this.flgLandFalse = false;
    } else {
      this.flgLandFalse = true;
      this.flgLandTrue = false;
    }
    // console.log("this/landState ", this.landState);
    // console.log("this/launchState ", this.launchState);
    // console.log("this.year ", this.year);

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
      // console.log("Inside else");
      this.appService.getAllSpaceX().subscribe((res: any) => {
        // console.log("Inside", this.landState);
        var land_status = this.landState;
        // console.log(typeof land_status);
        this.spaceXList = res.filter(function (elem: any) {
          // console.log("land_success is ", typeof elem.rocket.first_stage.cores[0].land_success);
          return JSON.stringify(elem.rocket.first_stage.cores[0].land_success) === land_status
        })
        // console.log("List is ", this.spaceXList);
        this.spaceXListCount = this.spaceXList.length;
        return;
      });
    }
  }

  // Resetting all the filters

  resetFilters() {
    this.flgLandFalse = false;
    this.flgLandTrue = false;
    this.flgLaunchFalse = false;
    this.flgLaunchTrue = false;
    this.filteredYear = "";
    this.appService.getAllSpaceX().subscribe((res: any) => {
      this.spaceXList = [];
      this.spaceXListCount = res.length;
      for (let i = 0; i < this.responseData.length; i++) {
        var parsedData = JSON.parse(JSON.stringify(this.responseData[i]));
        // console.log("res of is , ", parsedData)
        this.spaceXList.push(parsedData)
      }
      return;
    });
  }


}