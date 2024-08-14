import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Observable, from, mergeMap, switchMap, tap, toArray } from 'rxjs';
import { AgGridAngular, AngularFrameworkComponentWrapper, AngularFrameworkOverrides } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community'; 
import { SpinnerComponent } from '../spinner/spinner.component';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-lists',
  standalone: true,
  providers: [AgGridAngular, AngularFrameworkOverrides, AngularFrameworkComponentWrapper],
  imports: [ CommonModule, NgFor, AgGridAngular, SpinnerComponent],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css' 
  })
  
export class ListsComponent implements OnInit {

  topStoriesContent: any[] = [];
  apiServerUrl = 'http://localhost:3000';
  listToLoad = '';

  columnDefs: ColDef[] = [
    { field: 'title', headerName: 'Title', minWidth: 700 },
    { field: 'score', headerName: 'Score' },
    { field: 'by', headerName: 'Author' }, 
    {
        field: 'id',
        headerName: 'Link to article',
        cellRenderer: (params: any) => {
          return `<a href="https://news.ycombinator.com/item?id=${params.value}" target="_blank">Link to this article (${params.value})</a>`;
        },
      minWidth: 400
    }
  ];

   constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.listToLoad = params['listtype'];
    });
    this.getStories().subscribe({
      next: (results) => {
        this.topStoriesContent = results;
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  private getStories(): Observable<any[]> {
    switch (this.listToLoad) {
      default:
        return this.http.get<any[]>(`${this.apiServerUrl}/topstories`);
      case 'topstories':
        return this.http.get<any[]>(`${this.apiServerUrl}/topstories`);
      case 'beststories':
        return this.http.get<any[]>(`${this.apiServerUrl}/beststories`);
      case 'newstories':
        return this.http.get<any[]>(`${this.apiServerUrl}/newstories`);

    }
  }
}