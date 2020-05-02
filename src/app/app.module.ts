import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { NewPeopleComponent } from './components/new-people/new-people.component';
import { EditPeopleComponent } from './components/edit-people/edit-people.component';
import { ViewPeopleComponent } from './components/view-people/view-people.component';
import { FooterComponent } from './components/footer/footer.component';
import { AlertMessagesComponent } from './alert-messages/alert-messages.component';
import { HttpClientModule } from '@angular/common/http';
// services
import { RestService } from './services/rest.service';
import { EmptyDataComponent } from './empty-data/empty-data.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidebarComponent,
    HeaderComponent,
    NewPeopleComponent,
    EditPeopleComponent,
    ViewPeopleComponent,
    FooterComponent,
    AlertMessagesComponent,
    EmptyDataComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    RestService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
