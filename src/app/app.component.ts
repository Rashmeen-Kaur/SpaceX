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
  launchState: any;
  launchesCount = 0;
  constructor(private appService: AppService) { }

  ngOnInit() {
    console.log("Hello");

    this.appService.getAllSpaceX().subscribe(
      res => {
        //Prasing the response data
        this.responseData = JSON.parse(JSON.stringify(res));
        for (let i = 0; i < this.responseData.length; i++) {
          var parsedData = JSON.parse(JSON.stringify(this.responseData[i]));
          console.log("data of is , ", parsedData)
          this.spaceXList.push(parsedData)
        }
        //Storing launch years in local array
        var arr = this.spaceXList.map(function (data: any) {
          return data.launch_year
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
      }, (err) => {
        console.log(err);

      }
    );
  }

  filterLaunches(event: any) {
    this.launchState = event.target.textContent.toLowerCase();
    this.appService.getSpaceXLaunch(this.launchState).subscribe((data) => {
      this.spaceXList = data;
      this.launchesCount = data.length;
    });
  }

}



