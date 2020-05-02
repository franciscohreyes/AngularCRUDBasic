import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alert-messages',
  templateUrl: './alert-messages.component.html',
  styleUrls: ['./alert-messages.component.scss']
})
export class AlertMessagesComponent implements OnInit {
  @Input() type  : string;
  @Input() message: string;
  @Input() isShow: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * close
   */
  close() {
    this.type    = "";
    this.message = "";
    this.isShow  = false;
  }

}
