import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Review } from 'src/app/models/review.model';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-product-reviews',
  standalone: false,
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.css']
})
export class ProductReviewsComponent implements OnInit {
  reviews: Review[] = [];
  productId: string = '';

  constructor(private route: ActivatedRoute, private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.fetchReviews();
    });
  }

  fetchReviews(): void {
    this.reviewService.getReviewsByProductId(this.productId).subscribe(
      (reviews: Review[]) => {
        console.log('Reviews:', reviews); // Kiểm tra dữ liệu trả về
  
        // Xử lý dữ liệu reviews để đảm bảo customer và các trường của nó không bị undefined
        this.reviews = reviews.map(review => ({
          ...review,
          customer: {
            _id: review.customer?._id || '', // Giá trị mặc định nếu _id là undefined
            first_name: review.customer?.first_name || 'Người dùng', // Giá trị mặc định nếu first_name là undefined
            avatar: this.getAvatarUrl(review.customer?.avatar) // Chuyển đổi Base64 thành Data URL
          }
        }));
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }

  // Phương thức chuyển đổi Base64 thành Data URL
  getAvatarUrl(base64: string | undefined): string {
    if (!base64) {
      return 'assets/images/default-avatar.png'; // Ảnh mặc định nếu không có avatar
    }
    
    // Kiểm tra nếu đã có tiền tố MIME type
    if (base64.startsWith('data:image')) {
      return base64;
    }
  
    // Đoán định dạng ảnh dựa trên chuỗi base64
    const mimeType = base64.charAt(0) === '/' ? 'jpeg' : 'png'; // "/" cho JPEG, "i" cho PNG
    return `data:image/${mimeType};base64,${base64}`;
  }
  
  submitReview(comment: string, rating: string): void {
    const numericRating = Number(rating);
  
    if (isNaN(numericRating)) {
      console.error('Rating không hợp lệ!');
      return;
    }
  
    // Kiểm tra token trong localStorage
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Bạn cần đăng nhập để gửi đánh giá!');
      return;
    }

  
    // Gửi đánh giá lên server
    this.reviewService.createReview(this.productId, numericRating, comment).subscribe(
      (newReview: Review) => {
        console.log('New Review:', newReview); // Kiểm tra dữ liệu trả về
  
        // Thêm thông tin customer nếu không có
        const reviewWithCustomer = {
          ...newReview,
          customer: {
            _id: newReview.customer?._id || '', // Giá trị mặc định nếu _id là undefined
            first_name: newReview.customer?.first_name || 'Người dùng', // Giá trị mặc định nếu first_name là undefined
            avatar: this.getAvatarUrl(newReview.customer?.avatar) // Chuyển đổi Base64 thành Data URL
          }
        };
  
        this.reviews.unshift(reviewWithCustomer); // Thêm review mới vào đầu danh sách
        const reviewTextArea = document.querySelector('textarea') as HTMLTextAreaElement;
        if (reviewTextArea) reviewTextArea.value = ''; // Xóa nội dung ô nhập
      },
      (error) => {
        console.error('Error submitting review:', error);
      }
    );
  }
  
}