import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-related-blog',
  standalone: false,
  templateUrl: './related-blog.component.html',
  styleUrl: './related-blog.component.css'
})
export class RelatedBlogComponent {
  blogDetail: any = null;
  blogId: string | null = null;
  recommendedBlogs: any[] = [];

  // Danh sách blog giả lập
  blogs = [ // biến author chưa có trong database
    { id: '1', title: 'COLLAB Đạt giải hãng kính của năm', author: 'Admin', published_at: 'October 16, 2024', thumbnail: 'assets/images/home-banner1.png', content: '<p>Bài viết về hãng kính của năm...</p>' },
    { id: '2', title: '7 loại kính hot nhất 2025', author: 'Admin', published_at: 'October 16, 2024', thumbnail: 'assets/images/home-banner2.png', content: '<p>Những mẫu kính đang làm mưa làm gió...</p>' },
    { id: '3', title: 'Xu hướng chụp hình với kính', author: 'Admin', published_at: 'October 16, 2024', thumbnail: 'assets/images/home-banner3.png', content: '<p>Cách chụp hình đẹp với kính...</p>' },
    { id: '4', title: 'Chất liệu kính mắt tự chữa lành', author: 'Admin', published_at: 'October 16, 2023', thumbnail: 'assets/images/home-banner1.png', content: '<p>Công nghệ kính tự chữa lành...</p>' },
    { id: '5', title: 'Màu kính đạt giải Oscar', author: 'Admin', published_at: 'October 16, 2024', thumbnail: 'assets/images/home-banner3.png', content: '<p>Màu sắc kính xu hướng...</p>' }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Lấy ID từ URL
    this.route.params.subscribe(params => {
      this.blogId = params['id'];
      this.fetchBlogDetail(this.blogId);
      this.fetchRecommendedBlogs();
    });
  }

  fetchBlogDetail(blogId: string | null) {
    // Lấy bài viết tương ứng theo ID
    this.blogDetail = this.blogs.find(blog => blog.id === blogId);
  }

  fetchRecommendedBlogs() {
    // Lọc bài viết không trùng với bài hiện tại
    let relatedBlogs = this.blogs.filter(blog => blog.id !== this.blogId);

    // Trộn ngẫu nhiên danh sách bài viết
    this.recommendedBlogs = relatedBlogs
      .sort(() => Math.random() - 0.5) // Randomize order
      .slice(0, 3); // Chỉ lấy 3 bài viết
  }

  goToBlogDetail(id: string) {
    this.router.navigate(['/blog', id]); // Điều hướng đến trang bài viết mới
  }

  goToBlogList() {
    this.router.navigate(['/blog']); // Điều hướng về trang blog chính
  }
}
