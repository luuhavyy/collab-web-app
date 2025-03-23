import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';
import { Blog } from 'src/app/models/blog.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-blog-list',
  standalone:false,
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];
  filteredBlogs: Blog[] = [];
  categories: string[] = ['Tất cả', 'Bảo vệ mắt', 'Kiến thức', 'Sức khỏe'];
  selectedCategory: string = 'Tất cả';

  constructor(private router: Router, private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe({
      next: (data) => {
        this.blogs = data;
        this.filteredBlogs = [...this.blogs];
      },
      error: (error) => {
        console.error('Error fetching blogs', error);
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'Tất cả') {
      this.filteredBlogs = [...this.blogs];
    } else {
      this.filteredBlogs = this.blogs.filter(blog => blog.category === category);
    }
  }

  loadMore(): void {
    console.log('Tải thêm bài viết...');
  }
  navigateToBlog(blogId: string) {
    this.router.navigate(['/blog', blogId]);
  }

}