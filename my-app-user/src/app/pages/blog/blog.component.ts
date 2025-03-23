import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  standalone: false,
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})

export class BlogComponent {

  constructor(private router: Router) {}

  blogs = [
    { id: 1, title: '7 loại kính hot nhất 2025', category: 'Kiến thức', published_at: 'October 16, 2024', thumbnail: 'assets/images/aboutus.png' },
    { id: 2, title: 'Chất liệu kính mắt tự chữa lành', category: 'Sức khỏe', published_at: 'October 16, 2023', thumbnail: 'assets/images/aboutus.png' },
    { id: 3, title: 'Gọng kính không chỉ còn là gọng', category: 'Bảo vệ mắt', published_at: 'October 16, 2024', thumbnail: 'assets/images/aboutus.png' },
    { id: 4, title: 'Gọng kính thời trang 2024', category: 'Kiến thức', published_at: 'October 16, 2024', thumbnail: 'assets/images/aboutus.png' },
    { id: 5, title: 'Xu hướng chụp hình với kính', category: 'Kiến thức', published_at: 'October 16, 2024', thumbnail: 'assets/images/aboutus.png' },
    { id: 6, title: 'Cách bảo vệ mắt khỏi ánh sáng xanh', category: 'Bảo vệ mắt', published_at: 'October 10, 2023', thumbnail: 'assets/images/aboutus.png' }
  ];

  filteredBlogs = [...this.blogs]; // Mảng lưu các bài viết sau khi lọc

  categories = ['Tất cả', 'Bảo vệ mắt', 'Kiến thức', 'Sức khỏe'];
  selectedCategory: string = 'Tất cả';
  
  // Lọc bài viết theo danh mục
  filterByCategory(category: string) {
    this.selectedCategory = category;

    if (category === 'Tất cả') {
      this.filteredBlogs = [...this.blogs]; // Hiển thị tất cả bài viết
    } else {
      this.filteredBlogs = this.blogs.filter(blog => blog.category === category);
    }
  }

  loadMore() {
    console.log('Tải thêm bài viết...');
    // Gọi API backend để lấy thêm bài viết nếu cần
  }
}
