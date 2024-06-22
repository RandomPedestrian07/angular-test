import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Observable, from, mergeMap, switchMap, tap, toArray } from 'rxjs';
import { AgGridAngular, AngularFrameworkComponentWrapper, AngularFrameworkOverrides } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community'; 
import { SpinnerComponent } from '../spinner/spinner.component';


@Component({
  selector: 'app-lists',
  standalone: true,
  providers: [AgGridAngular, AngularFrameworkOverrides, AngularFrameworkComponentWrapper],
  imports: [HttpClientModule, CommonModule, NgFor, AgGridAngular, SpinnerComponent],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css' 
  })
  
export class ListsComponent implements OnInit {

  topStoriesArray: number[] = [];
  topStoriesContent: any[] = [];
  cacheDuration = 900000;
  header: String = '';
  isLoading = false;

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

   constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const cachedData = localStorage.getItem('topStoriesCache');
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const cacheAge = Date.now() - timestamp;
      if (cacheAge < this.cacheDuration) {
        const cacheLeft: number = (this.cacheDuration - cacheAge) / 1000 / 60;
        this.header = 'Using cached data, about ' + Math.round(cacheLeft) + ' minutes left before cache is refreshed';
        this.topStoriesContent = data;
      } else {
        this.header = "Cache is expired, fetching updated data";
        this.getTopStoriesArray();
      }
    } else {
      this.header = "No cache found, fetching data";
      this.getTopStoriesArray();
    }
  }

  private getTopStoriesArray(): void {
    this.isLoading = true;
    this.http.get<number[]>('https://hacker-news.firebaseio.com/v0/topstories.json').pipe(
      switchMap(stories =>
        from(stories).pipe(
          mergeMap(id => this.getStory(id)),
          toArray()
        )
      ),
      tap(storiesDetails => {
        const cacheData = { data: storiesDetails, timestamp: Date.now() };
        localStorage.setItem('topStoriesCache', JSON.stringify(cacheData));
        console.log('Cached new data:', cacheData);
        this.topStoriesContent = storiesDetails;
        this.header = 'New data has been loaded';
        this.isLoading = false;
      })
    ).subscribe({
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false;
      }
    });
  }

  private getStory(id: number): Observable<any> {
    return this.http.get<any>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
  }
}