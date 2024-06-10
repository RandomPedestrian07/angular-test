import { Routes } from '@angular/router';
import { AboutMeComponent } from './about-me/about-me.component';
import { ListsComponent } from './lists/lists.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'about-me', component: AboutMeComponent},
    {path: 'lists', component: ListsComponent},
];
