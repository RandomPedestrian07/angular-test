import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AgGridAngular, AngularFrameworkComponentWrapper, AngularFrameworkOverrides } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community'; 
import { Observable } from 'rxjs';

@Component({
  selector: 'app-listdetails',
  standalone: true,
  providers: [AgGridAngular, AngularFrameworkOverrides, AngularFrameworkComponentWrapper],
  imports: [HttpClientModule, CommonModule, NgFor, AgGridAngular],
  templateUrl: './listdetails.component.html',
  styleUrl: './listdetails.component.css'
})
export class ListdetailsComponent implements OnInit {

  specificStoryContent: any;
  storyId = '';


  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.storyId = params['id'];
    });
    this.getSpecificStory().subscribe({
      next: (storyValue) => {
        this.specificStoryContent = storyValue;
        console.log(this.specificStoryContent);
      }
    })




    
  }


  private getSpecificStory(): Observable<any[]> {
    let id = this.storyId;
    return this.http.get<any[]>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
  }

  
}
