import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { settings } from '../../settings';
// service
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-view-people',
  templateUrl: './view-people.component.html',
  styleUrls: ['./view-people.component.scss']
})
export class ViewPeopleComponent implements OnInit {
  private socket       : any;
  public people        : any;
  public people_id     : any;
  private newPeopleForm: FormGroup;
  public typeAlert     : string = "";
  public showMessageSuccess: boolean = false;
  public urlMedia: any = settings.URL_MEDIA;

  constructor(
    private router     : Router,
    private route      : ActivatedRoute,
    private formBuilder: FormBuilder,
    private api        : RestService) {
      this.people_id = this.route.snapshot.params['id'];
      
      this.newPeopleForm = this.formBuilder.group({
        name     : ['', Validators.required],
        email    : ['', Validators.required],
        telephone: ['', Validators.required],
        biography: ['', Validators.required]
      });
    }

  ngOnInit() {
    this.socket = io('http://localhost:3000');
    this.getPeople();
  }

  /**
   * getPeople
   */
  getPeople(){
    this.api.getPeopleById(this.people_id).subscribe(data=>{
      if(data.success == true){
        this.people = data.items[0];
        this.newPeopleForm.setValue({
          name: this.people.name,
          email: this.people.email,
          telephone: this.people.phone,
          biography: this.people.biography
        });
      } else if(data.success == false){
        this.people = [];
      }
    });
  }
  
  /**
   * updatePeople
   */
  updatePeople() {
    let data = {people_id: this.people_id, name: this.newPeopleForm.value['name'], email: this.newPeopleForm.value['email'], phone: this.newPeopleForm.value['telephone'], biography: this.newPeopleForm.value['biography']};

    this.api.updatePeople(data).subscribe(result=>{
      console.log(result)
      if(result.success == true){
        this.getPeople();
        this.typeAlert = "success";
        this.showMessageSuccess = true;
        this.socket.emit('editItem', (data) => {
          console.log("send new item ", data);
        });
      } else if(result.success == false) {
        console.log("dato no guardado");
      }
    });
  }
}
