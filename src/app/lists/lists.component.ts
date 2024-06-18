import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, from, mergeMap, switchMap, toArray } from 'rxjs';
import { AgGridAngular, AngularFrameworkComponentWrapper, AngularFrameworkOverrides } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community'; 


@Component({
  selector: 'app-lists',
  standalone: true,
  providers: [AgGridAngular, AngularFrameworkOverrides, AngularFrameworkComponentWrapper],
  imports: [HttpClientModule, CommonModule, NgFor, AgGridAngular],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css' 
  })
  
export class ListsComponent implements OnInit {

  topStoriesArray: number[] = [];
  topStoriesContent: any[] = [];

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
    this.getTopStoriesArray().subscribe({
      next: (results) => {
        this.topStoriesContent = results;
        console.log(this.topStoriesContent);
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }
  

  private getTopStoriesArray(): Observable<any[]> {
    return this.http.get<number[]>('https://hacker-news.firebaseio.com/v0/topstories.json').pipe(
      switchMap(stories => 
        from(stories).pipe(
          mergeMap(id => this.http.get<any>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)),
          toArray()
        )
      )
    );
  }

}
