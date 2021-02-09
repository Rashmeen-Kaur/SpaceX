import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import * as _ from 'underscore';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'Application/json; charset=UTF-8',
    'authorization': 'Bearer',
    'mode': 'no-cors'
  }),
};


@Injectable({
  providedIn: 'root'
})
export class AppService {
  httpPath: string = 'https://api.spaceXdata.com/v3/launches';
  constructor(private http: HttpClient) { }

  getAllSpaceX() {
    const body = JSON.stringify({});
    console.log("Request body is ", body);
    return this.http.get(this.httpPath + "?limit=100").pipe(map((response) => {
      return response;
    }), tap(event => { }, this.handleError))
  }
  private handleError(err: Error | HttpErrorResponse) {
    console.log("Error in handleError is ", err);
  }
}
