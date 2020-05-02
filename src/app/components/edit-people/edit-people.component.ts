import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { settings } from '../../settings';
// service
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-edit-people',
  templateUrl: './edit-people.component.html',
  styleUrls: ['./edit-people.component.scss']
})
export class EditPeopleComponent implements OnInit {
  private socket       : any;
  public people        : any;
  public people_id     : any;
  private editPeopleForm: FormGroup;
  public typeAlert     : string = "";
  public message: string = "";
  public showMessageSuccess: boolean = false;
  public urlMedia: string = settings.URL_MEDIA;
  public picture: any;
  public pictureUpload: any = "";

  constructor(
    private router     : Router,
    private route      : ActivatedRoute,
    private formBuilder: FormBuilder,
    private api        : RestService) {
      this.people_id = this.route.snapshot.params['id'];
    }

  ngOnInit() {
    this.socket = io('http://localhost:3000');
    this.getPeople();
    this.editPeopleForm = this.formBuilder.group({
      name     : ['', Validators.required],
      email    : ['', Validators.required],
      telephone: ['', Validators.required],
      biography: ['', Validators.required],
      fileSource: ['']
    });
  }

  /**
   * getPeople
   */
  getPeople(){
    this.api.getPeopleById(this.people_id).subscribe(data=>{
      if(data.success == true){
        this.people = data.items[0];
        this.editPeopleForm.setValue({
          name     : this.people.name,
          email    : this.people.email,
          telephone: this.people.phone,
          biography: this.people.biography,
          fileSource: this.people.image,
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
    const formData = new FormData();
    formData.append('people_id', this.people_id);
    formData.append('name', this.editPeopleForm.value['name']);
    formData.append('email', this.editPeopleForm.value['email']);
    formData.append('phone', this.editPeopleForm.value['telephone']);
    formData.append('biography', this.editPeopleForm.value['biography']);
    formData.append('picture', this.editPeopleForm.get('fileSource').value);

    this.api.updatePeople(formData).subscribe(data=>{
      if(data.success == true){
        this.getPeople();
        this.typeAlert = "success";
        this.message = data.msg;
        this.showMessageSuccess = true;
        this.picture = "";
        this.socket.emit('editItem', (data) => {
        });
      } else if(data.success == false) {
        this.typeAlert = "danger";
        this.message = data.msg;
        this.showMessageSuccess = true;
      }
    });
  }

  /**
   * onChange
   * @param fileInput
   */
  onChange(fileInput: any) {
    if(fileInput.target.files.length > 0){
      this.pictureUpload = fileInput.target.files[0];
      this.editPeopleForm.patchValue({
        fileSource: this.pictureUpload
      });
      let reader = new FileReader();
      reader.onload = ((e) => {
        this.picture = e.target['result'];
      });
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }
}
