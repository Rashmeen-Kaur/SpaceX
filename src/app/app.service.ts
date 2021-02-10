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
    let params = new HttpParams();
    params = params.append('limit', '100');
    return this.http.get(this.httpPath, { params: params }).pipe(map((response) => {
      return response;
    }), tap(event => { }, this.handleError))
  }

  getSpaceXLaunch(param: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('launch_success', param);
    return this.http.get(this.httpPath, { params: params });
  }

  getAllSpaces(launch_year: any, launch_success: any, land_success: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('limit', '100');
    params = params.append('launch_success', launch_success);
    params = params.append('land_success', land_success);
    params = params.append('launch_year', launch_year);
    return this.http.get(this.httpPath, { params: params }).pipe(map((response) => {
      return response;
    }), tap(event => { }, this.handleError));

  }

  getLaunchLand(launch_success: any, land_success: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('limit', '100');
    params = params.append('launch_success', launch_success);
    params = params.append('land_success', land_success);
    return this.http.get(this.httpPath, { params: params }).pipe(map((response) => {
      return response;
    }), tap(event => { }, this.handleError));
  }

  private handleError(err: Error | HttpErrorResponse) {
    console.log("Error in handleError is ", err);
  }
}

