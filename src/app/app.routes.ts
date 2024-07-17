import { Routes } from '@angular/router';
import { AboutMeComponent } from './about-me/about-me.component';
import { ListsComponent } from './lists/lists.component';
import { HomeComponent } from './home/home.component';
import { ListdetailsComponent } from './listdetails/listdetails.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'about-me', component: AboutMeComponent},
    {path: 'lists', component: ListsComponent},
    {path: 'lists/:listtype', component: ListsComponent},
    {path: 'lists/:id', component: ListdetailsComponent}
];
