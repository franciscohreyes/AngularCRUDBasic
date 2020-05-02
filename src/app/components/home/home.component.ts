import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as Rx from 'rxjs/Rx';
import { ActivatedRoute, Router } from '@angular/router';
// service
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private socket  : any;
  ioConnection    : any;
  public peoples  : any;
  public posts    : any;
  observer        : any;
  public typeAlert: string = "";
  public message  : string = "";
  public showMessageSuccess: boolean = false;

  constructor(
    private router: Router,
    private route : ActivatedRoute,
    private api   : RestService) {}

  ngOnInit() {
    this.socket = io('http://localhost:3000');
    this.getPeoples();

    this.socket.on('listPeople', (data) =>{
      this.getPeoples();
    });
  }

  reload() {
    this.socket.emit('refresh_odds');
  }

  /**
   * getPeoples
   */
  getPeoples() {
    this.api.getListPeople().subscribe(data=>{
      if(data.success == true){
        this.peoples = data.items;
      } else if(data.success == false){
        this.peoples = [];
      }
    });
  }

  /**
   * deletePeople
   */
  deletePeople(people_id) {
    let data = {people_id: people_id};

    this.api.deletePeopleById(data).subscribe(data=>{
      if(data.success == true){
        this.getPeoples();
        this.typeAlert = "success";
        this.message = data.msg;
        this.showMessageSuccess = true;
        this.socket.emit('deleteItem', () => {
        });
      } else if(data.success == false){
        this.getPeoples();
        this.peoples = [];
        this.typeAlert = "danger";
        this.message = data.msg;
        this.showMessageSuccess = true;
      }
    });
  }
}
