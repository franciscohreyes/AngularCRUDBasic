import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs-compat/operator/map';
import { Observable } from 'rxjs/Observable';
import { settings } from '../settings';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  private socket;
  private API_ENDPOINT: string = settings.API_URL;

  constructor(
    private http: HttpClient
  ) { }

  /* socket io connection */
  connect(){
    this.socket = io.connect('http://localhost:3000');

    this.socket.on('list', event => {
      console.log(event);
    });

    return () => this.socket.disconnect();
  }

  getListPeople(): Observable<any> {
    return this.http.get(this.API_ENDPOINT+"getPeople");
  }

  saveNewPeople(data): Observable<any> {
    return this.http.post(this.API_ENDPOINT+"saveNewPeople",data);
  }

  getPeopleById(people_id:number): Observable<any> {
    return this.http.get(this.API_ENDPOINT+"getPeopleById?people_id="+people_id);
  }

  updatePeople(data): Observable<any> {
    return this.http.post(this.API_ENDPOINT+"updatePeople",data);
  }

  deletePeopleById(data): Observable<any> {
    return this.http.post(this.API_ENDPOINT+"deletePeopleById", data);
  }

  getActivity(): Observable<any> {
    return this.http.get(this.API_ENDPOINT+"getActivityFeed");
  }

  deleteActivityById(data): Observable<any> {
    return this.http.post(this.API_ENDPOINT+"deleteActivityById", data);
  }

  getTotal(type:string): Observable<any> {
    return this.http.get(this.API_ENDPOINT+"getTotal?type="+type);
  }
}
