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
  constructor(private appService: AppService) { }

  ngOnInit() {
    console.log("Hello");

    this.appService.getAllSpaceX().subscribe(
      res => {
        this.responseData = JSON.parse(JSON.stringify(res));

        for (let i = 0; i < this.responseData.length; i++) {

          var parsedData = JSON.parse(JSON.stringify(this.responseData[i]));
          console.log("data of is , ", parsedData)
          this.spaceXList.push(parsedData)
        }



      }, (err) => {
        console.log(err);

      }
    );
  }
}
