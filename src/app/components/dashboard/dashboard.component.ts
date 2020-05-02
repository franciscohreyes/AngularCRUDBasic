import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
// services
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private socket    : any;
  public activity   : any;
  public totalActive: any;
  public totalInactive: any;

  constructor(private api: RestService) { }

  ngOnInit() {
    this.getActivity();
    this.getTotal();
    this.socket = io('http://localhost:3000');

    this.socket.on('listActivity', (data) => {
      console.log("lista de registros ", data);
      this.getActivity();
      this.getTotal();
    });

    // this.socket.on('listTotalActive', (data) => {
    //   this.getTotal();
    // });

    // this.socket.on('listTotalInactive', (data) => {
    //   this.getTotal();
    // });
  }

  getActivity() {
    this.api.getActivity().subscribe((data) => {
      if(data.success == true){
        this.activity = data.items;
      } else if(data.success == false){
        this.activity = [];
      }
    }),err=>{
      console.log(err);
    };
  }

  deleteActivity(activity_id) {
    console.log(activity_id)
    let data = {activity_id: activity_id};

    this.api.deleteActivityById(data).subscribe(data=>{
      if(data.success == true){
        this.getActivity();
        // console.log(this.peoples);
      } else if(data.success == false){
        this.getActivity();
        // this.peoples = [];
      }
    });
  }

  getTotal() {
    this.api.getTotal("active").subscribe((data) => {
      if(data.success == true){
        this.totalActive = data.items[0];
      } else if(data.success == false){
        this.totalActive = 0;
      }
    }),err=>{
      console.log(err);
    };

    this.api.getTotal("inactive").subscribe((data) => {
      if(data.success == true){
        this.totalInactive = data.items[0];
      } else if(data.success == false){
        this.totalInactive = 0;
      }
    }),err=>{
      console.log(err);
    };
  }

}
