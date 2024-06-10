import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [HttpClientModule, CommonModule, NgFor],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit {

  topStoriesArray: any[] = [];
  topStoriesContent: any = {};

  constructor (private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getTopStoriesArray();
    console.log(this.topStoriesContent);
  }

  private getTopStoriesArray() {
    this.http.get('https://hacker-news.firebaseio.com/v0/topstories.json').subscribe(stories => {
      this.topStoriesArray = stories as number[];
      }
    )
    for (let i = 0; i < this.topStoriesArray.length; i++) {
      this.http.get('https://hacker-news.firebaseio.com/v0/item/' + this.topStoriesArray[i]).subscribe(storiesContent => {
      this.topStoriesContent.push(storiesContent);
      }
    )
    }
  }

  private getTopStoriesFromArray() {
    for (let i = 0; i < this.topStoriesArray.length; i++) {
      this.http.get('https://hacker-news.firebaseio.com/v0/item/' + this.topStoriesArray[i]).subscribe(storiesContent => {
      this.topStoriesContent.push(storiesContent);
      }
    )
    }
  }

}
