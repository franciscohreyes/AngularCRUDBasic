import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NewPeopleComponent } from './components/new-people/new-people.component';
import { EditPeopleComponent } from './components/edit-people/edit-people.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ViewPeopleComponent } from './components/view-people/view-people.component';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path:'dashboard', component: DashboardComponent },
  { path:'people', component: HomeComponent },
  { path:'new', component: NewPeopleComponent },
  { path:'edit/:id', component: EditPeopleComponent },
  { path:'view/:id', component: ViewPeopleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
