import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from 'src/app/services/blog.service';
import { Blog } from 'src/app/models/blog.model';

@Component({
  selector: 'app-blog-content',
  standalone:false,
  templateUrl: './blog-content.component.html',
  styleUrls: ['./blog-content.component.css']
})
export class BlogContentComponent implements OnInit {
  blogDetail: Blog | null = null;
  blogId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.blogId = params['id'];
      if (this.blogId) {
        this.blogService.getBlogById(this.blogId).subscribe({
          next: (data) => {
            this.blogDetail = data;
          },
          error: (error) => {
            console.error('Error fetching blog detail', error);
          }
        });
      }
    });
  }
}