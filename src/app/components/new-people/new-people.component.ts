import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import * as io from 'socket.io-client';
// service
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-new-people',
  templateUrl: './new-people.component.html',
  styleUrls: ['./new-people.component.scss']
})
export class NewPeopleComponent implements OnInit {
  private socket       : any;
  private newPeopleForm: FormGroup;
  public typeAlert: string = "";
  public message  : string = "";
  public showMessageSuccess: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private api: RestService) {
    this.newPeopleForm = this.formBuilder.group({
      name     : ['', Validators.required],
      email    : ['', Validators.required],
      telephone: ['', Validators.required],
      biography: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.socket = io('http://localhost:3000');
  }

  /**
   * register
   */
  register() {
    let newItem = {name: this.newPeopleForm.value['name'], email: this.newPeopleForm.value['email'], phone: this.newPeopleForm.value['telephone'], biography: this.newPeopleForm.value['biography']};

    this.api.saveNewPeople(newItem).subscribe(data=>{
      if(data.success == true){
        this.resetForm();
        this.typeAlert = "success";
        this.message = data.msg;
        this.showMessageSuccess = true;
        this.socket.emit('addNewItem', (data) => {
          console.log("send new item ", data);
        });
      } else if(data.success == false) {
        this.resetForm();
        this.typeAlert = "danger";
        this.message = data.msg;
        this.showMessageSuccess = true;
      }
    });
  }

  /**
   * resetForm
   */
  resetForm() {
    this.newPeopleForm.reset();
    this.typeAlert = "";
    this.message = "";
    this.showMessageSuccess = false;
  }
}
