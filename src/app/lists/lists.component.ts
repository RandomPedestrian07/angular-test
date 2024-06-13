import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, from, mergeMap, switchMap, toArray } from 'rxjs';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [HttpClientModule, CommonModule, NgFor],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit {

  topStoriesArray: number[] = [];
  topStoriesContent: any[] = [];
  specificStoryContent: any;
  storyId = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.storyId = params['id'];
    });
    if (this.isSpecificId) {
      this.getSpecificStory().subscribe({
        next: (storyValue) => {
          this.specificStoryContent = storyValue;
          console.log(this.specificStoryContent);
        }
      })
    }
    if (!this.isSpecificId) {
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

  private getSpecificStory(): Observable<any[]> {
    let id = this.storyId;
    return this.http.get<any[]>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
  }

  get isSpecificId() {
    return this.storyId ?  true : false;
  }

}
